import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Dimensions, Image, ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Node positions mirroring the logo's triangle geometry ────────────────────
const NODES = [
  { x: SCREEN_WIDTH * 0.5,  y: 80,                  r: 14, delay: 0    }, // top-center (the ringed node)
  { x: SCREEN_WIDTH * 0.18, y: 200,                 r: 20, delay: 400  }, // bottom-left
  { x: SCREEN_WIDTH * 0.82, y: 200,                 r: 20, delay: 800  }, // bottom-right
  { x: SCREEN_WIDTH * 0.3,  y: 155,                 r: 5,  delay: 200  }, // mid-left edge
  { x: SCREEN_WIDTH * 0.7,  y: 155,                 r: 5,  delay: 600  }, // mid-right edge
];

// ─── Animated background node ─────────────────────────────────────────────────
function NetworkNode({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, { toValue: 1,   duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        backgroundColor: r > 10 ? 'transparent' : '#FFFFFF',
        borderWidth: r > 10 ? 2 : 0,
        borderColor: '#FFFFFF',
        opacity: pulse,
      }}
    />
  );
}

// ─── SVG-like connecting line between two nodes ───────────────────────────────
function NodeLine({ x1, y1, x2, y2 }: { x1:number; y1:number; x2:number; y2:number }) {
  const dx = x2 - x1, dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle  = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length,
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.12)',
        transform: [{ rotate: `${angle}deg` }],
        transformOrigin: 'left center',
      }}
    />
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

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
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      shake();
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      setError(err.message);
      shake();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first, then tap "Forgot password?"');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Email Sent', `Password reset instructions sent to ${email.trim()}`);
    } catch {
      Alert.alert('Error', 'Could not send reset email. Please check the address.');
    }
  };

  return (
    <View style={styles.container}>

      {/* ── Background: pure black like logo ── */}
      <View style={StyleSheet.absoluteFill} />

      {/* ── Animated network graph (mirrors logo geometry) ── */}
      <View style={styles.networkCanvas} pointerEvents="none">
        {/* Lines first, behind nodes */}
        <NodeLine x1={NODES[0].x} y1={NODES[0].y} x2={NODES[1].x} y2={NODES[1].y} />
        <NodeLine x1={NODES[0].x} y1={NODES[0].y} x2={NODES[2].x} y2={NODES[2].y} />
        <NodeLine x1={NODES[1].x} y1={NODES[1].y} x2={NODES[2].x} y2={NODES[2].y} />

        {/* Nodes */}
        {NODES.map((n, i) => (
          <NetworkNode key={i} {...n} />
        ))}

        {/* Inner ring on top node — matches the logo's double-circle detail */}
        <View style={styles.topNodeOuter} />
        <View style={styles.topNodeInner} />
      </View>

      {/* ── Very subtle white radial glow from top center ── */}
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'transparent']}
        style={styles.topGlow}
      />

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

            {/* ── Logo + wordmark ── */}
            <View style={styles.logoSection}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/icons.jpg')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>REILO</Text>
              <Text style={styles.appTagline}>Referral Intelligence Platform</Text>
            </View>

            {/* ── Form card ── */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

              <Text style={styles.welcomeTitle}>Sign in</Text>
              <Text style={styles.welcomeSub}>Enter your credentials to continue</Text>

              {/* Error banner */}
              {!!error && (
                <View style={styles.errorBanner}>
                  <Feather name="alert-circle" size={14} color="#FCA5A5" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Email */}
              <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
                <Feather
                  name="mail"
                  size={17}
                  color={emailFocused ? '#FFFFFF' : '#555'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#444"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>

              {/* Password */}
              <View style={[styles.inputWrap, passFocused && styles.inputWrapFocused]}>
                <Feather
                  name="lock"
                  size={17}
                  color={passFocused ? '#FFFFFF' : '#555'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#444"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={17} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Forgot */}
              <TouchableOpacity style={styles.forgotRow} onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In — white button matching logo's white nodes */}
              <TouchableOpacity
                style={[styles.signInBtn, loading && { opacity: 0.6 }]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Text style={styles.signInBtnText}>Sign In</Text>
                    <Feather name="arrow-right" size={19} color="#000000" />
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Create account — outline button */}
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => router.push('/signup')}
                activeOpacity={0.8}
              >
                <Text style={styles.createBtnText}>Create an account</Text>
              </TouchableOpacity>

            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // ── Network graph canvas ───────────────────────────────────────────────────
  networkCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  // Top node double-ring (matches logo detail)
  topNodeOuter: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.5 - 14,
    top: 80 - 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  topNodeInner: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.5 - 6,
    top: 80 - 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  topGlow: {
    position: 'absolute',
    top: 0,
    left: SCREEN_WIDTH * 0.2,
    right: SCREEN_WIDTH * 0.2,
    height: 260,
    borderRadius: 999,
  },

  safeArea: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'center',
    minHeight: SCREEN_HEIGHT - 60,
  },

  // ── Logo section ──────────────────────────────────────────────────────────
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    // White glow to match white nodes
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 6,
    marginBottom: 6,
  },
  appTagline: {
    color: '#3a3a3a',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Form card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#0d0d0d',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  welcomeSub: {
    color: '#444',
    fontSize: 13,
    marginBottom: 24,
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: { color: '#FCA5A5', fontSize: 13, flex: 1 },

  // ── Inputs ────────────────────────────────────────────────────────────────
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222222',
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  inputWrapFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: '#161616',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  eyeBtn: { padding: 4 },

  // ── Forgot ────────────────────────────────────────────────────────────────
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 24,
  },
  forgotText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Sign In button — white, matching logo nodes ───────────────────────────
  signInBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  signInBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1a1a1a',
  },
  dividerText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ── Create account button — outline ──────────────────────────────────────
  createBtn: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
});
