import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addReferral } from '../services/api';

export default function AddReferralScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const handleSubmit = async () => {
    if (!name || !company || !role || !email) return;
    setLoading(true);
    try {
      const result = await addReferral({
        name,
        company,
        role,
        linkedin,
        email,
        location,
        notes,
        status: 'Pending',
        time: 'Just now',
        statusColor: '#D97706',
        statusBg: '#FFFBEB',
        statusBorder: '#FEF3C7',
        dotColor: '#FBBF24',
      });

      if (result.inviteEmailSent === false) {
        Alert.alert(
          'Referral added',
          'Your referral was saved, but the invite email could not be sent. Please check the email address and try again later.'
        );
      }

      router.back();
    } catch (error) {
      console.error('Failed to add referral', error);
      Alert.alert('Failed to add referral', 'Make sure you are logged in, the email is valid, and the API server is running.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E1B4B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      />
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Referral</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Nitin Pansare" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} placeholder="e.g. Dublin, Ireland" value={location} onChangeText={setLocation} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput style={styles.input} placeholder="e.g. Emerson" value={company} onChangeText={setCompany} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <TextInput style={styles.input} placeholder="e.g. Associate Director" value={role} onChangeText={setRole} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LinkedIn URL</Text>
            <TextInput style={styles.input} placeholder="https://linkedin.com/in/..." value={linkedin} onChangeText={setLinkedin} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <Text style={styles.helperText}>An invite email will be sent asking if they are willing to refer you.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="How do you know this person?"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity style={[styles.submitButton, (!name || !company || !role || !email) && { opacity: 0.5 }]} onPress={handleSubmit} disabled={!name || !company || !role || !email || loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Add Referral & Send Invite</Text>}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#161C33',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
