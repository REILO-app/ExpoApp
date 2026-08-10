import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import {
  ChevronLeft, Send, Paperclip, FileText, X,
  UploadCloud, AlertTriangle, Zap, RefreshCw
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GoogleGenAI } from '@google/genai';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { fetchReferralById } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Referrer Details Interface
interface ReferrerDetails {
  name: string;
  title?: string;
  company?: string;
  notes?: string;
  email?: string;
}

// Job Details Interface
interface JobDetails {
  role: string;
  company: string;
  jobId?: string;
  location?: string;
  jd?: string;
  link?: string;
}

export default function EmailDraftScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Retrieve job and referral parameters from router params
  const { referralId, role, company, jobId, location, jd, link } = useLocalSearchParams();
  const rId = Array.isArray(referralId) ? referralId[0] : referralId || '1';

  // State Management
  const [model] = useState<'gemini-3.5-flash'>('gemini-3.5-flash');
  const [generating, setGenerating] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [referrer, setReferrer] = useState<ReferrerDetails>({ name: '' });
  const [jobDetails, setJobDetails] = useState<JobDetails>({ role: '', company: '' });

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // State for attached resume
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<any | null>(null);
  const [attachmentMimeType, setAttachmentMimeType] = useState<string>('application/pdf');

  useEffect(() => {
    const initialize = async () => {
      try {
        let referralData: any = {};
        if (rId) {
          referralData = await fetchReferralById(rId);
        }

        const refDetails = {
          name: referralData.name || '',
          title: referralData.role || '',
          company: referralData.company || '',
          email: referralData.email || '',
          notes: referralData.notes || '',
        };
        setReferrer(refDetails);

        const jDetails = {
          role: (Array.isArray(role) ? role[0] : role) || referralData.role || '',
          company: (Array.isArray(company) ? company[0] : company) || referralData.company || '',
          jobId: (Array.isArray(jobId) ? jobId[0] : jobId) || '',
          location: (Array.isArray(location) ? location[0] : location) || referralData.location || '',
          jd: (Array.isArray(jd) ? jd[0] : jd) || '',
          link: (Array.isArray(link) ? link[0] : link) || ''
        };
        setJobDetails(jDetails);
        setLoadingInitial(false);
        handleGenerateEmail(model, refDetails, jDetails);
      } catch (err) {
        console.error(err);
        setLoadingInitial(false);
      }
    };
    initialize();
  }, [rId]);


  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAttachmentUri(asset.uri);
        setAttachmentName(asset.name || 'resume.pdf');
        if (asset.file) setAttachmentFile(asset.file);
        if (asset.mimeType) setAttachmentMimeType(asset.mimeType);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUri(null);
    setAttachmentName(null);
    setAttachmentFile(null);
  };

  const handleGenerateEmail = async (modelToUse: typeof model, currentReferrer = referrer, currentJob = jobDetails) => {
    setGenerating(true);
    setRateLimited(false);

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      Alert.alert(
        'Gemini API Key Required',
        'Please add EXPO_PUBLIC_GEMINI_API_KEY to your apps/mobile/.env file to generate email drafts directly from the app.',
        [{ text: 'OK' }]
      );
      setGenerating(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a professional, helpful assistant who drafts polite, warm, and highly personalized job referral request emails.

Write a referral request email using the details below:

SENDER/CANDIDATE DETAILS:
- Name: ${user?.name || 'Candidate'}

REFERRER DETAILS (the person being asked):
- Name: ${currentReferrer.name}
${currentReferrer.company ? `- Company: ${currentReferrer.company}` : ''}
${currentReferrer.title ? `- Role/Title: ${currentReferrer.title}` : ''}
${currentReferrer.notes ? `- Relationship / Connection Notes: ${currentReferrer.notes}` : ''}

TARGET JOB DETAILS:
- Role / Title: ${currentJob.role}
- Company: ${currentJob.company}
${currentJob.location ? `- Location: ${currentJob.location}` : ''}
${currentJob.jobId ? `- Job ID: ${currentJob.jobId}` : ''}
${currentJob.link ? `- Job URL: ${currentJob.link}` : ''}
${currentJob.jd ? `- Job Description:\n${currentJob.jd}` : ''}

INSTRUCTIONS:
1. Compose a highly professional email requesting a job referral for this target job.
2. Tone: Adapt the tone based on the Relationship / Connection Notes. 
   - If the relationship note indicates they are close (e.g., family member like a father, a close friend, a former close colleague), make the tone warm, friendly, appreciative, but still clear about the job request.
   - If it's a professional connection or someone they haven't spoken to in a while, make it polite, respectful, clear, and professional.
3. Keep the email concise: write a polite opening, a brief paragraph explaining why the candidate is a good fit or interested in the role, a polite ask for the referral (mentioning the resume is attached/available), and a warm close.
4. Keep the subject line short, clear, and highly relevant.

Return the result as a JSON object matching this schema:
{
  "subject": "The subject line of the email",
  "body": "The full body of the email. Keep paragraphs separated by double newlines (\\n\\n)."
}`;

      const response = await ai.models.generateContent({
        model: modelToUse || 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              subject: { type: 'STRING' },
              body: { type: 'STRING' }
            },
            required: ['subject', 'body']
          }
        }
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error('Failed to retrieve content from Gemini API response');
      }

      const parsed = JSON.parse(rawText.trim());
      if (parsed.subject && parsed.body) {
        setSubject(parsed.subject);
        setBody(parsed.body);
      } else {
        throw new Error('JSON response from Gemini was missing subject or body fields');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Generation Failed',
        error?.message || 'Failed to generate email draft using Gemini.'
      );

      // Fallback draft content
      setSubject(`Referral Request for ${currentJob.role} role at ${currentJob.company}`);
      setBody(
        `Hi ${referrer.name},\n\nHope you're doing well! I'm reaching out because I saw an exciting opportunity for ${jobDetails.role} at ${jobDetails.company}.\n\nGiven your experience at ${jobDetails.company}, I would be incredibly grateful if you'd be open to referring me or sharing any insights about the role.\n\nBest regards,\n${user?.name || 'Applicant'}`
      );
    } finally {
      setGenerating(false);
    }
  };

  // Direct Send Email
  const handleSend = async () => {
    const emailRecipient = referrer.email?.trim();
    if (!emailRecipient) {
      Alert.alert('Missing Email', 'No email address found for this referrer. Please edit their contact details first.');
      return;
    }

    setSending(true);

    try {
      const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      let fetchOptions: RequestInit;

      if (attachmentUri) {
        // Multi-part form data if attachment exists
        const formData = new FormData();
        formData.append('to', emailRecipient);
        formData.append('subject', subject);
        formData.append('body', body);
        formData.append('jobId', jobDetails.jobId || '1');
        formData.append('referralId', rId);
        formData.append('senderName', user?.name || '');
        formData.append('senderEmail', user?.email || '');

        if (Platform.OS === 'web' && attachmentFile) {
          formData.append('resume', attachmentFile);
        } else {
          const base64 = await FileSystem.readAsStringAsync(attachmentUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: attachmentMimeType || 'application/pdf' });
          formData.append('resume', blob, attachmentName || 'resume.pdf');
        }

        fetchOptions = {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        };
      } else {
        fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            to: emailRecipient,
            subject,
            body,
            jobId: jobDetails.jobId || '1',
            referralId: rId,
            senderName: user?.name || '',
            senderEmail: user?.email || '',
          }),
        };
      }

      const response = await fetch(`${apiBaseUrl}/api/send-email`, fetchOptions);
      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Server error sending email');
      }

      Alert.alert('Email Sent! 🚀', 'Your referral request was sent successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error sending mail:', error);
      Alert.alert('Sending Failed', error?.message || 'Could not send email.');
    } finally {
      setSending(false);
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
          <Text style={styles.headerTitle}>Review Draft</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>

            {/* Top Parameters Card */}
            {loadingInitial ? (
              <ActivityIndicator size="large" color="#6366F1" style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.contextCard}>
                <View style={styles.contextHeader}>
                  <Send size={16} color="#6366F1" />
                  <Text style={styles.contextTitle}>Referral Target</Text>
                </View>
                <Text style={styles.contextReferrer}>
                  To: <Text style={styles.boldText}>{referrer.name}</Text> ({referrer.title || 'Contact'} at {referrer.company})
                </Text>
                <Text style={styles.contextJob}>
                  For: <Text style={styles.boldText}>{jobDetails.role}</Text> @ {jobDetails.company}
                </Text>
              </View>
            )}

            {/* Resume Attachment Card */}
            <View style={styles.attachmentCard}>
              <View style={styles.attachmentHeader}>
                <Paperclip size={16} color="#374151" style={{ marginRight: 6 }} />
                <Text style={styles.attachmentTitle}>Resume Attachment</Text>
              </View>

              {attachmentName ? (
                <View style={styles.fileRow}>
                  <View style={styles.fileInfo}>
                    <FileText size={20} color="#6B7280" style={{ marginRight: 10 }} />
                    <Text style={styles.fileName} numberOfLines={1}>
                      {attachmentName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleRemoveAttachment} style={styles.removeBtn}>
                    <X size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={handlePickDocument} style={styles.uploadBtn} activeOpacity={0.8}>
                  <UploadCloud size={18} color="#6B7280" style={{ marginRight: 8 }} />
                  <Text style={styles.uploadBtnText}>Upload Resume PDF</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Info Status Card */}
            <View style={[
              styles.infoCard,
              rateLimited && styles.rateLimitedInfoCard
            ]}>
              {rateLimited ? (
                <AlertTriangle size={20} color="#DC2626" style={styles.infoIcon} />
              ) : (
                <Zap size={20} color="#059669" style={styles.infoIcon} />
              )}
              <Text style={[
                styles.infoText,
                rateLimited && styles.rateLimitedInfoText
              ]}>
                {generating
                  ? 'Generating email via AI...'
                  : rateLimited
                    ? 'Daily limit reached. Using template.'
                    : 'Email draft generated successfully.'
                }
              </Text>
            </View>

            {generating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>AI is crafting your request...</Text>
              </View>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Enter email subject"
                    placeholderTextColor="#9CA3AF"
                    editable={!rateLimited}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Body</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={body}
                    onChangeText={setBody}
                    multiline
                    placeholder="Enter email body"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {!rateLimited ? (
                  <TouchableOpacity
                    style={styles.regenerateButton}
                    onPress={() => handleGenerateEmail(model)}
                    activeOpacity={0.8}
                  >
                    <RefreshCw size={16} color="#6366F1" style={{ marginRight: 8 }} />
                    <Text style={styles.regenerateButtonText}>Regenerate Draft</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    sending && styles.submitButtonDisabled
                  ]}
                  onPress={handleSend}
                  disabled={sending}
                >
                  {sending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Send size={18} color="#FFFFFF" style={styles.submitIcon} />
                      <Text style={styles.submitButtonText}>Send Referral Request</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
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
  contextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  contextTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextReferrer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  contextJob: {
    fontSize: 14,
    color: '#6B7280',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#111827',
  },
  attachmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attachmentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  removeBtn: {
    padding: 4,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 14,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginBottom: 20,
  },
  rateLimitedInfoCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#059669',
    flex: 1,
    lineHeight: 18,
  },
  rateLimitedInfoText: {
    color: '#DC2626',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
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
  regenerateButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
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
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    elevation: 0,
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
