import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Image, ScrollView,
} from 'react-native';
import {
  AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight,
  ChevronLeft, Sparkles, LucideIcon
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { logEventSafe } from '../config/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      shake();
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      logEventSafe('login', { method: 'email' });
      // AuthGuard redirects to (tabs) automatically
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found'
        ? 'Invalid email or password.'
        : err.message || 'Sign in failed.';
      setError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (email.trim()) {
      router.push({ pathname: '/forgot-password', params: { email: email.trim() } });
    } else {
      router.push('/forgot-password');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient matching signup */}
      <LinearGradient
        colors={['#080d18', '#0F1629', '#080d18']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow blobs matching signup */}
      <View style={[styles.glow, { top: -80, right: -80, backgroundColor: 'rgba(99,102,241,0.12)' }]} />
      <View style={[styles.glow, { bottom: 100, left: -60, backgroundColor: 'rgba(16,185,129,0.08)' }]} />

      <SafeAreaView style={styles.safeArea}>


        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Illustration Emblem */}
            <View style={styles.illustrationWrap}>
              <View style={styles.iconBg}>
                <View style={styles.iconRing}>
                  <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.appName}>REILO</Text>
              <Text style={styles.appTagline}>Referral Intelligence Platform</Text>

              {/* Decorative dots */}
              <View style={[styles.dot, { top: 10, right: 40, backgroundColor: '#818CF8', opacity: 0.4 }]} />
              <View style={[styles.dot, { bottom: 20, left: 50, backgroundColor: '#34D399', opacity: 0.3, width: 6, height: 6 }]} />
            </View>

            {/* Form card mirroring signup card styling */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
              <Text style={styles.cardTitle}>Sign in to REILO</Text>
              <Text style={styles.cardSub}>Enter your credentials to access your account</Text>

              {/* Error banner */}
              {!!error && (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color="#FCA5A5" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Email Input */}
              <InputField
                icon={Mail}
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password Input */}
              <InputField
                icon={Lock}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                    {showPassword ? (
                      <Eye size={18} color="#475569" />
                    ) : (
                      <EyeOff size={18} color="#475569" />
                    )}
                  </TouchableOpacity>
                }
              />

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotRow} onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* CTA Container matching signup */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#111827" />
                ) : (
                  <>
                    <Text style={styles.ctaBtnText}>Sign In</Text>
                    <ArrowRight size={20} color="#111827" />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.signupRow}>
                <Text style={styles.signupRowText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Create account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Shared InputField (matches signup.tsx) ───────────────────────────────────

function InputField({
  icon: IconComponent, placeholder, value, onChangeText,
  keyboardType, autoCapitalize, secureTextEntry, rightElement,
}: {
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[ifStyles.wrap, focused && ifStyles.wrapFocused]}>
      <IconComponent size={18} color={focused ? '#818CF8' : '#475569'} style={ifStyles.icon} />
      <TextInput
        style={ifStyles.input}
        placeholder={placeholder}
        placeholderTextColor="#475569"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'none'}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCorrect={false}
      />
      {rightElement}
    </View>
  );
}

const ifStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 12,
  },
  wrapFocused: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.06)',
  },
  icon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
});

// ─── Styles (aligned with signup.tsx) ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080d18',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  safeArea: {
    flex: 1,
  },

  // ── Header ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    justifyContent: 'center',
  },

  // ── Illustration Section ──
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99,102,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 4,
  },
  appTagline: {
    color: '#64748B',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ── Form Card ──
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardSub: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  // ── Error Banner ──
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },

  // ── Forgot Password Link ──
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: 2,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── CTA Container ──
  ctaContainer: {
    width: '100%',
  },
  ctaBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  ctaBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Signup Footer Row ──
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupRowText: {
    color: '#64748B',
    fontSize: 14,
  },
  signupLink: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '700',
  },
});
