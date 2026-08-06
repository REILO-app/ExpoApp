import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

// ─── Auth guard ───────────────────────────────────────────────────────────────
// Redirects unauthenticated users to /login and authenticated users away from it.

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const seg = segments[0] as string;
    const onAuthScreen = seg === 'login' || seg === 'signup' || seg === 'forgot-password';

    if (!user && !onAuthScreen) {
      // Not logged in and not on an auth screen → go to login
      router.replace('/login');
    } else if (user && onAuthScreen) {
      // Logged in but on auth screens → go to app
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#6366F1" size="large" />
      </View>
    );
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
