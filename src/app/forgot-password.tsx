import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconBubble}>
              <Feather name={sent ? 'check-circle' : 'mail'} size={28} color={sent ? '#34D399' : '#818CF8'} />
            </View>

            <Text style={styles.title}>{sent ? 'Email Sent!' : 'Reset Password'}</Text>
            <Text style={styles.subtitle}>
              {sent
                ? `We've sent password reset instructions to\n${email.trim()}`
                : 'Enter the email associated with your account and we\'ll send reset instructions.'}
            </Text>

            {!sent && (
              <>
                {/* Email input */}
                <View style={[styles.inputWrapper, focused && styles.inputFocused]}>
                  <Feather name="mail" size={18} color={focused ? '#818CF8' : '#4B5563'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </View>

                {/* Send button */}
                <TouchableOpacity
                  style={[styles.sendBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSend}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sendGradient}
                  >
                    {loading
                      ? <ActivityIndicator color="#FFFFFF" />
                      : <Text style={styles.sendText}>Send Reset Email</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {sent && (
              <TouchableOpacity style={styles.backToLoginBtn} onPress={() => router.replace('/login')}>
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </TouchableOpacity>
            )}

            {!sent && (
              <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
                <Text style={styles.cancelText}>← Back to Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

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
  backBtn: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    alignItems: 'center',
  },
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    height: 54,
    width: '100%',
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.06)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  sendBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  sendGradient: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  backToLoginBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
  },
  backToLoginText: {
    color: '#818CF8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelLink: {
    marginTop: 4,
  },
  cancelText: {
    color: '#64748B',
    fontSize: 14,
  },
});
