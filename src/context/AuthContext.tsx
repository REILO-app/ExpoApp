import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { API_URL } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  company?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  location?: string;
}

export interface SignUpProfile {
  name: string;
  phone?: string;
  role?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: SignUpProfile) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helper: sync Firebase user to our MongoDB backend ───────────────────────

const syncUserToBackend = async (
  firebaseUser: FirebaseUser,
  profile?: SignUpProfile,
): Promise<User> => {
  const idToken = await firebaseUser.getIdToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(profile ?? {}),
    });
    console.log("profile", res);
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL}. Start the backend with "npm start" in apps/api.`,
    );
  }

  if (!res.ok) {
    let message = 'Failed to sync user profile';
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      // response body wasn't JSON
    }
    throw new Error(message);
  }

  return res.json();
};

const fallbackUserFromFirebase = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email ?? '',
  name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingProfileRef = useRef<SignUpProfile | null>(null);

  useEffect(() => {
    // Firebase will call this whenever the auth state changes —
    // on app start (to restore session), after login, and after logout.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profileData = pendingProfileRef.current ?? undefined;
          pendingProfileRef.current = null;
          const profile = await syncUserToBackend(firebaseUser, profileData);
          setUser(profile);
        } catch (err) {
          console.error('Failed to sync user on auth state change:', err);
          // Keep the Firebase session alive with a minimal profile until the API is reachable
          setUser(fallbackUserFromFirebase(firebaseUser));
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Clean up listener on unmount
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged handles backend sync and setUser
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const signUp = async (email: string, password: string, profile: SignUpProfile) => {
    try {
      pendingProfileRef.current = profile;
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged handles backend sync and setUser
    } catch (err: any) {
      pendingProfileRef.current = null;
      throw new Error(err.message || 'Signup failed');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to send reset email');
    }
  };

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    const profile = await syncUserToBackend(firebaseUser);
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
