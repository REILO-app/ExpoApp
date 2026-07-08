import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AddReferralScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Referral</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Nitin Pansare" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput style={styles.input} placeholder="e.g. Emerson" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <TextInput style={styles.input} placeholder="e.g. Associate Director" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LinkedIn URL</Text>
            <TextInput style={styles.input} placeholder="https://linkedin.com/in/..." />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="email@example.com" keyboardType="email-address" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="How do you know this person?"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
            <Text style={styles.submitButtonText}>Add Referral</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
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
