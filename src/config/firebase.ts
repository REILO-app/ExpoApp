import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, getAuth, browserLocalPersistence, Auth } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig as any);
  auth = initializeAuth(app, {
    persistence: Platform.OS === 'web' 
      ? browserLocalPersistence 
      : inMemoryPersistence,
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };

// Analytics is not supported in React Native — skip it entirely to avoid
// the "getElementsByTagName of undefined" crash from @firebase/analytics
export const logEventSafe = (_name: string, _params?: Record<string, any>) => {
  // no-op in React Native
};

export default app;
