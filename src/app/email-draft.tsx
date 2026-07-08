import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EmailDraftScreen() {
  const router = useRouter();
  const { referralId } = useLocalSearchParams();

  // Mock AI generated content
  const [subject, setSubject] = useState("Referral Request for Senior Frontend Engineer Role");
  const [body, setBody] = useState(
    "Hi Nitin,\n\n" +
    "I hope this email finds you well!\n\n" +
    "I saw that Emerson is currently hiring for a Senior Frontend Engineer, and given your experience there as an Associate Director, I wanted to ask if you would be open to referring me for this position.\n\n" +
    "I have 5 years of experience building scalable React applications and I believe my background aligns perfectly with the job description. I have attached my resume and the job link below for your convenience.\n\n" +
    "If you're comfortable, I'd really appreciate your referral. If not, no worries at all!\n\n" +
    "Best regards,\n" +
    "[Your Name]"
  );

  const handleSend = () => {
    // In the future, this will POST to /api/jobs/:jobId/send-email
    router.push('/');
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
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Draft</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            
            <View style={styles.infoCard}>
              <Feather name="sparkles" size={20} color="#059669" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Your email is ready! Review the AI-generated draft below. You can edit the subject and body before sending it off.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput 
                style={styles.input} 
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Body</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={body}
                onChangeText={setBody}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSend}>
              <Feather name="send" size={18} color="#FFFFFF" style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Send Referral Request</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
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
    marginBottom: 10,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: '#047857',
    fontSize: 13,
    lineHeight: 18,
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
    height: 280,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#161C33',
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: '#161C33',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
