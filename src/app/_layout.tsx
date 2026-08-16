import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// ─── Auth guard ───────────────────────────────────────────────────────────────
// Redirects unauthenticated users to /login and authenticated users away from it.

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const rootSegment = segments[0] as string;
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (loading) return;

    const onAuthScreen = rootSegment === 'login' || rootSegment === 'signup' || rootSegment === 'forgot-password';

    if (!isAuthenticated && !onAuthScreen) {
      // Not logged in and not on an auth screen → go to login
      router.replace('/login');
    } else if (isAuthenticated && onAuthScreen) {
      // Logged in but on auth screens → go to app
      router.replace('/(tabs)');
    }

    // Hide splash screen once we know the auth state
    SplashScreen.hideAsync();
  }, [isAuthenticated, loading, rootSegment]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="referral/[id]" />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}
