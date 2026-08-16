import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { updateUserProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ChangeEmailScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async () => {
    const trimmedPassword = currentPassword.trim();
    const trimmedEmail = newEmail.trim();

    if (!trimmedPassword) {
      Alert.alert('Error', 'Please enter your current password to proceed.');
      return;
    }
    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your new email address.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (trimmedEmail.toLowerCase() === user?.email.toLowerCase()) {
      Alert.alert('Error', 'New email address must be different from your current email.');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No active user session found. Please sign in again.');
      }

      // 1. Reauthenticate user (Firebase security requirement for email changes)
      const credential = EmailAuthProvider.credential(currentUser.email || '', trimmedPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Update email in Firebase Authentication
      await updateEmail(currentUser, trimmedEmail);

      // 3. Sync update to MongoDB backend
      await updateUserProfile({ email: trimmedEmail });

      // 4. Refresh local app context state
      await refreshUser();

      Alert.alert('Success', 'Your email address has been updated successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Failed to update email:', error);
      let errorMessage = 'Failed to update email. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect current password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The new email address format is invalid.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already registered with another account.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'For security reasons, please log out and log back in to perform this action.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={['#080d18ff', '#080d18ff', '#1E293B', '#1E1B4B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.indigoGlow} />
        <View style={styles.emeraldGlow} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Change Email</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                To change your email address, you must enter your current password for security verification.
              </Text>
            </View>

            {/* Current Email Display */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Email</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                <Text style={styles.currentEmailText}>{user?.email}</Text>
              </View>
            </View>

            {/* New Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Enter new email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Verification */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verify Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActionContainer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleUpdateEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Update Email Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 280, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  indigoGlow: { position: 'absolute', top: -120, right: -130, width: 256, height: 256, borderRadius: 128, backgroundColor: 'rgba(99, 102, 241, 0.18)' },
  emeraldGlow: { position: 'absolute', bottom: -60, left: -50, width: 192, height: 192, borderRadius: 96, backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 32 },
  backButton: { padding: 8, marginLeft: -8 },
  pageTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 100 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.02, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  infoBox: { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14, marginBottom: 20 },
  infoText: { color: '#4F46E5', fontSize: 13, lineHeight: 18, fontWeight: '500' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 52 },
  disabledInput: { backgroundColor: '#E5E7EB', opacity: 0.8 },
  inputIcon: { marginRight: 12 },
  currentEmailText: { flex: 1, color: '#4B5563', fontSize: 16, fontWeight: '500' },
  input: { flex: 1, color: '#111827', fontSize: 16, fontWeight: '500' },
  bottomActionContainer: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#161C33', borderRadius: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: -4 }, shadowRadius: 10 },
  saveButton: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
