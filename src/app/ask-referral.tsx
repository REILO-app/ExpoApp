import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addJob, fetchReferralById, addReferralHistoryEvent } from '../services/api';

export default function AskReferralScreen() {
  const router = useRouter();
  const { referralId } = useLocalSearchParams();

  const [jobLink, setJobLink] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');

  const handleDraft = async () => {
    const roleValue = role.trim();
    const companyValue = company.trim();
    const jobLinkValue = jobLink.trim();
    const jdValue = jd.trim();

    const params = new URLSearchParams();
    if (referralId) params.append('referralId', Array.isArray(referralId) ? referralId[0] : referralId);
    if (roleValue) params.append('role', roleValue);
    if (companyValue) params.append('company', companyValue);
    if (jobLinkValue) params.append('link', jobLinkValue);
    if (jdValue) params.append('jd', jdValue);

    if (roleValue || companyValue || jobLinkValue || jdValue) {
      try {
        const referralIdValue = Array.isArray(referralId) ? referralId[0] : referralId;
        let referralName = 'Pending referral';

        if (referralIdValue) {
          try {
            const referral = await fetchReferralById(referralIdValue);
            referralName = referral?.name || referralName;

            await addReferralHistoryEvent(referralIdValue, {
              type: 'referral_requested',
              title: 'Referral Request Sent',
              description: `Referral request for ${roleValue || 'a role'} at ${companyValue || 'a company'} was sent to ${referralName}`,
              icon: 'mail',
              color: '#6366F1'
            });
          } catch (error) {
            console.error('Failed to fetch referral or log history', error);
          }
        }

        await addJob({
          company: companyValue || 'Untitled Company',
          role: roleValue || 'Untitled Role',
          jobId: '',
          location: '',
          type: '',
          jd: jdValue,
          link: jobLinkValue,
          status: 'Pending AI Draft',
          referrer: referralName,
          statusColor: '#D97706',
          statusBg: '#FFFBEB',
        });
      } catch (error) {
        console.error('Failed to save job from ask referral flow', error);
      }
    }

    router.push(`/email-draft?${params.toString()}`);
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
          <Text style={styles.headerTitle}>Ask for Referral</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Feather name="info" size={20} color="#4F46E5" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Provide the job details below. Our AI will automatically generate a highly personalised referral request email tailored for this contact.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Link or ID (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. https://careers.company.com/job/123"
              value={jobLink}
              onChangeText={setJobLink}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Role (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Software Dev / Frontend Engineer"
              value={role}
              onChangeText={setRole}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Orvera AI"
              value={company}
              onChangeText={setCompany}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Paste the full job description here. This helps the AI write a highly relevant email highlighting your fit."
              multiline
              numberOfLines={8}
              value={jd}
              onChangeText={setJd}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleDraft}
          >
            <Feather name="zap" size={18} color="#FFFFFF" style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>Draft Email with AI</Text>
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: '#4338CA',
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
    height: 160,
    textAlignVertical: 'top',
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
