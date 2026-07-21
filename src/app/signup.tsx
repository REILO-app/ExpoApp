import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');

  const scrollRef = useRef<ScrollView>(null);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: step * SCREEN_WIDTH, animated: true });
  }, [step]);

  const validateStep = () => {
    if (step === 0) {
      if (!name.trim()) {
        Alert.alert('Required Field', 'Please enter your full name.');
        return false;
      }
    }
    if (step === 1) {
      if (!email.trim()) {
        Alert.alert('Required Field', 'Please enter your email address.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return false;
      }
      if (!phone.trim()) {
        Alert.alert('Required Field', 'Please enter your phone number.');
        return false;
      }
    }
    if (step === 2) {
      if (!profession.trim()) {
        Alert.alert('Required Field', 'Please enter your profession.');
        return false;
      }
    }
    if (step === 3) {
      if (!company.trim()) {
        Alert.alert('Required Field', 'Please enter your current job / study place.');
        return false;
      }
    }
    if (step === 4) {
      if (!password || password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#161C33']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Segmented Progress Bar */}
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.progressBarSegment,
                i <= step && styles.progressBarSegmentActive
              ]}
            />
          ))}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: SCREEN_WIDTH * 6 }}
          >
            {/* Step 1: Full Name */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>What is your name?</Text>
                <Text style={styles.subtitle}>Enter your full name to display on your network card.</Text>
                
                <View style={styles.inputContainer}>
                  <Feather name="user" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#8E9BB3"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            </View>

            {/* Step 2: Email & Phone */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>How can we reach you?</Text>
                <Text style={styles.subtitle}>These details are used to receive updates and refer candidates.</Text>
                
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#8E9BB3"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="phone" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor="#8E9BB3"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            </View>

            {/* Step 3: Profession */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>What is your profession?</Text>
                <Text style={styles.subtitle}>Tell us your job role or primary field of expertise.</Text>
                
                <View style={styles.inputContainer}>
                  <Feather name="briefcase" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="e.g. Software Engineer, Designer"
                    placeholderTextColor="#8E9BB3"
                    value={profession}
                    onChangeText={setProfession}
                  />
                </View>
              </View>
            </View>

            {/* Step 4: Job/Study */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Where do you work/study?</Text>
                <Text style={styles.subtitle}>Enter your current company, university, or organization.</Text>
                
                <View style={styles.inputContainer}>
                  <Feather name="home" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="e.g. Emerson, Google, MIT"
                    placeholderTextColor="#8E9BB3"
                    value={company}
                    onChangeText={setCompany}
                  />
                </View>
              </View>
            </View>

            {/* Step 5: Password */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Secure your account</Text>
                <Text style={styles.subtitle}>Choose a secure password with at least 6 characters.</Text>
                
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#8E9BB3" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8E9BB3"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>
            </View>

            {/* Step 6: Review */}
            <View style={styles.slide}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Review details</Text>
                <Text style={styles.subtitle}>Confirm your registration details are correct.</Text>
                
                <View style={styles.reviewWrapper}>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Name</Text>
                    <Text style={styles.reviewValue}>{name}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Email</Text>
                    <Text style={styles.reviewValue}>{email}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Phone</Text>
                    <Text style={styles.reviewValue}>{phone}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Profession</Text>
                    <Text style={styles.reviewValue}>{profession}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Organization</Text>
                    <Text style={styles.reviewValue}>{company}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleNext}>
              <Text style={styles.loginButtonText}>
                {step === 5 ? 'Create Account' : 'Continue'}
              </Text>
              <Feather name="arrow-right" size={20} color="#111827" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  progressBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarSegmentActive: {
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewWrapper: {
    marginTop: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
