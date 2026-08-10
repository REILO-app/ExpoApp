import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, ScrollView, Dimensions, KeyboardAvoidingView,
  Platform, Alert, ActivityIndicator, Image,
} from 'react-native';
import {
  ChevronLeft, User, Mail, Phone, Briefcase, Building,
  Lock, CheckCircle, Eye, EyeOff, ArrowRight, LucideIcon, LucideProps
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { logEventSafe } from '../config/firebase';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS: Array<{
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  sub: string;
}> = [
  {
    icon: User,
    iconColor: '#818CF8',
    iconBg: 'rgba(99,102,241,0.15)',
    label: "What's your name?",
    sub: 'Your name appears on your professional network card.',
  },
  {
    icon: Mail,
    iconColor: '#34D399',
    iconBg: 'rgba(16,185,129,0.12)',
    label: 'How can we reach you?',
    sub: 'Used for updates and referral confirmations.',
  },
  {
    icon: Briefcase,
    iconColor: '#FBBF24',
    iconBg: 'rgba(251,191,36,0.12)',
    label: "What's your profession?",
    sub: 'Tell us your role or primary field of expertise.',
  },
  {
    icon: Building,
    iconColor: '#F472B6',
    iconBg: 'rgba(244,114,182,0.12)',
    label: 'Where do you work?',
    sub: 'Your current company, university, or organization.',
  },
  {
    icon: Lock,
    iconColor: '#818CF8',
    iconBg: 'rgba(99,102,241,0.15)',
    label: 'Secure your account',
    sub: 'Choose a strong password — at least 6 characters.',
  },
  {
    icon: CheckCircle,
    iconColor: '#34D399',
    iconBg: 'rgba(16,185,129,0.15)',
    label: 'Almost there!',
    sub: 'Review your details before creating your account.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Track step changes for analytics & progress bar
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: step * SCREEN_WIDTH, animated: true });
    Animated.timing(progressAnim, {
      toValue: ((step + 1) / STEPS.length),
      duration: 350,
      useNativeDriver: false,
    }).start();

    // Log each step as a funnel event
    logEventSafe('signup_step_viewed', { step_index: step, step_name: STEPS[step]?.label });
  }, [step]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const validateStep = (): boolean => {
    const show = (msg: string) => { Alert.alert('Required', msg); shake(); };
    if (step === 0 && !name.trim()) { show('Please enter your full name.'); return false; }
    if (step === 1) {
      if (!email.trim()) { show('Please enter your email.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('Enter a valid email address.'); return false; }
      if (!phone.trim()) { show('Please enter your phone number.'); return false; }
    }
    if (step === 2 && !profession.trim()) { show('Please enter your profession.'); return false; }
    if (step === 3 && !company.trim()) { show('Please enter your organization.'); return false; }
    if (step === 4 && password.length < 6) { show('Password must be at least 6 characters.'); return false; }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Final step — create account
      setLoading(true);
      try {
        await signUp(email.trim(), password, {
          name: name.trim(),
          phone: phone.trim(),
          role: profession.trim(),
          company: company.trim(),
        });
        logEventSafe('sign_up', { method: 'email' });
        // AuthGuard redirects to (tabs) automatically
      } catch (err: any) {
        Alert.alert('Sign Up Failed', err.message);
        shake();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else router.back();
  };

  const stepInfo = STEPS[step];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#080d18', '#0F1629', '#080d18']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow blobs */}
      <View style={[styles.glow, { top: -80, right: -80, backgroundColor: 'rgba(99,102,241,0.12)' }]} />
      <View style={[styles.glow, { bottom: 100, left: -60, backgroundColor: 'rgba(16,185,129,0.08)' }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Horizontal page scroller */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: SCREEN_WIDTH * STEPS.length }}
            style={{ flex: 1 }}
          >
            {/* ── Step 0: Full Name ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 0 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={0} name={name} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[0].label}</Text>
                <Text style={styles.cardSub}>{STEPS[0].sub}</Text>
                <InputField
                  icon={User} placeholder="Full Name"
                  value={name} onChangeText={setName}
                />
              </View>
            </Animated.View>

            {/* ── Step 1: Contact ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 1 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={1} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[1].label}</Text>
                <Text style={styles.cardSub}>{STEPS[1].sub}</Text>
                <InputField icon={Mail} placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <InputField icon={Phone} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
            </Animated.View>

            {/* ── Step 2: Profession ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 2 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={2} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[2].label}</Text>
                <Text style={styles.cardSub}>{STEPS[2].sub}</Text>
                <InputField icon={Briefcase} placeholder="e.g. Software Engineer, Designer" value={profession} onChangeText={setProfession} />
              </View>
            </Animated.View>

            {/* ── Step 3: Company ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 3 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={3} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[3].label}</Text>
                <Text style={styles.cardSub}>{STEPS[3].sub}</Text>
                <InputField icon={Building} placeholder="e.g. Google, MIT, Freelance" value={company} onChangeText={setCompany} />
              </View>
            </Animated.View>

            {/* ── Step 4: Password ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 4 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={4} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[4].label}</Text>
                <Text style={styles.cardSub}>{STEPS[4].sub}</Text>
                <InputField
                  icon={Lock} placeholder="Password"
                  value={password} onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  rightElement={
                    <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                      {showPass ? (
                        <Eye size={18} color="#475569" />
                      ) : (
                        <EyeOff size={18} color="#475569" />
                      )}
                    </TouchableOpacity>
                  }
                />
              </View>
            </Animated.View>

            {/* ── Step 5: Review ── */}
            <Animated.View style={[styles.slide, { transform: [{ translateX: step === 5 ? shakeAnim : 0 }] }]}>
              <StepIllustration step={5} />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{STEPS[5].label}</Text>
                <Text style={styles.cardSub}>{STEPS[5].sub}</Text>
                <View style={styles.reviewList}>
                  <ReviewRow label="Name" value={name} icon={User} />
                  <ReviewRow label="Email" value={email} icon={Mail} />
                  <ReviewRow label="Phone" value={phone} icon={Phone} />
                  <ReviewRow label="Profession" value={profession} icon={Briefcase} />
                  <ReviewRow label="Organization" value={company} icon={Building} />
                </View>
              </View>
            </Animated.View>
          </ScrollView>

          {/* CTA button */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#111827" />
              ) : (
                <>
                  <Text style={styles.ctaBtnText}>
                    {step === STEPS.length - 1 ? 'Create Account' : 'Continue'}
                  </Text>
                  {step < STEPS.length - 1 && <ArrowRight size={20} color="#111827" />}
                </>
              )}
            </TouchableOpacity>

            {step === 0 && (
              <View style={styles.loginRow}>
                <Text style={styles.loginRowText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Step Illustration ────────────────────────────────────────────────────────

function StepIllustration({ step, name }: { step: number; name?: string }) {
  const info = STEPS[step];
  const IconComponent = info.icon;
  return (
    <View style={illStyles.container}>
      <View style={[illStyles.iconBg, { backgroundColor: info.iconBg }]}>
        <View style={illStyles.iconRing}>
          <IconComponent size={36} color={info.iconColor} />
        </View>
      </View>
      {step === 5 && !!name && (
        <View style={illStyles.nameBadge}>
          <Text style={illStyles.nameBadgeText}>Hi, {name.split(' ')[0]}! 👋</Text>
        </View>
      )}
      {/* Decorative dots */}
      <View style={[illStyles.dot, { top: 0, right: 20, backgroundColor: info.iconColor, opacity: 0.4 }]} />
      <View style={[illStyles.dot, { bottom: 10, left: 30, backgroundColor: info.iconColor, opacity: 0.25, width: 6, height: 6 }]} />
    </View>
  );
}

const illStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    position: 'relative',
  },
  iconBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(52,211,153,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  nameBadgeText: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 14,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

// ─── Shared InputField ────────────────────────────────────────────────────────

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
        autoCapitalize={autoCapitalize ?? 'words'}
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

// ─── Review Row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value, icon: IconComponent }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <View style={rrStyles.row}>
      <View style={rrStyles.iconBox}>
        <IconComponent size={14} color="#818CF8" />
      </View>
      <Text style={rrStyles.label}>{label}</Text>
      <Text style={rrStyles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const rrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99,102,241,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: { color: '#64748B', fontSize: 13, fontWeight: '600', width: 90 },
  value: { flex: 1, color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'right' },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080d18' },
  glow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  safeArea: { flex: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  stepLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    paddingRight: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: 'rgba(15,22,41,0.95)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.12)',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  cardSub: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  reviewList: { marginTop: 4 },

  ctaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ctaBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginRowText: { color: '#64748B', fontSize: 14 },
  loginLink: { color: '#818CF8', fontSize: 14, fontWeight: '700' },
});
