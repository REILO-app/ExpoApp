import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter, useLocalSearchParams } from 'expo-router';

const MOCK_JOBS: Record<string, {
  id: string; company: string; role: string; jobId: string; jd: string; link: string;
  status: string; statusColor: string; statusBg: string; referrer: string; location: string; type: string;
}> = {
  '1': {
    id: '1',
    company: 'Emerson',
    role: 'Senior Frontend Engineer',
    jobId: 'EMR-2026-FE-4812',
    jd: `We are looking for a Senior Frontend Engineer to join our growing team at Emerson.\n\nResponsibilities:\n• Build and maintain high-quality web and mobile applications\n• Collaborate with designers and backend engineers\n• Write clean, maintainable, and well-tested code\n• Mentor junior engineers and conduct code reviews\n• Drive technical decisions for frontend architecture\n\nRequirements:\n• 5+ years of experience in frontend development\n• Strong proficiency in React, TypeScript, and modern CSS\n• Experience with React Native is a plus\n• Excellent problem-solving and communication skills\n• Bachelor's degree in Computer Science or equivalent`,
    link: 'https://careers.emerson.com/jobs/senior-frontend-engineer',
    status: 'Email Sent',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    referrer: 'Nitin Pansare',
    location: 'Pune, India (Hybrid)',
    type: 'Full-time',
  },
  '2': {
    id: '2',
    company: 'Amazon',
    role: 'Software Engineer II',
    jobId: 'AMZ-SDE2-2026-001',
    jd: `Amazon is seeking a Software Engineer II to build customer-facing products at global scale.\n\nResponsibilities:\n• Design, develop and deploy scalable software services\n• Work in an agile environment with fast iteration cycles\n• Participate in on-call rotations and drive incident resolution\n• Write high quality technical documentation\n\nRequirements:\n• 3+ years of software development experience\n• Strong knowledge of data structures and algorithms\n• Experience with distributed systems and microservices\n• Proficiency in at least one OOP language (Java, Python, Go)\n• Strong verbal and written communication skills`,
    link: 'https://www.amazon.jobs/en/jobs/software-engineer-ii',
    status: 'Pending AI Draft',
    statusColor: '#D97706',
    statusBg: '#FFFBEB',
    referrer: 'Yogesh',
    location: 'Bangalore, India (On-site)',
    type: 'Full-time',
  },
};

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = MOCK_JOBS[id as string];

  if (!job) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Job not found</Text>
      </View>
    );
  }

  const handleOpenLink = () => {
    Linking.openURL(job.link).catch(() =>
      Alert.alert('Error', 'Could not open link')
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient banner — same as all other pages */}
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={['#080d18ff', '#080d18ff', '#1E293B', '#1E1B4B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={15} tint="dark" style={styles.indigoGlow} />
        <BlurView intensity={15} tint="dark" style={styles.emeraldGlow} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header block */}
        <View style={styles.profileHeader}>
          <View style={styles.companyIconLarge}>
            <Feather name="briefcase" size={32} color="#8E9BB3" />
          </View>
          <Text style={styles.companyName}>{job.company}</Text>
          <Text style={styles.roleName}>{job.role}</Text>
          <View style={[styles.statusPill, { backgroundColor: job.statusBg }]}>
            <Text style={[styles.statusText, { color: job.statusColor }]}>{job.status}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Feather name="map-pin" size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaPill}>
              <Feather name="clock" size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Job Details card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Job Details</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="hash" size={16} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Job ID</Text>
                <Text style={styles.infoValue}>{job.jobId}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="briefcase" size={16} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.infoValue}>{job.company}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="user" size={16} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Referrer</Text>
                <Text style={styles.infoValue}>{job.referrer}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow} onPress={handleOpenLink} activeOpacity={0.7}>
              <View style={[styles.infoIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Feather name="external-link" size={16} color="#4F46E5" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Job Link</Text>
                <Text style={[styles.infoValue, { color: '#4F46E5' }]} numberOfLines={1}>
                  {job.link}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* JD card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Job Description</Text>
            <Text style={styles.jdText}>{job.jd}</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Apply Now CTA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.applyButton} onPress={handleOpenLink}>
            <Feather name="external-link" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 320,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden',
  },
  indigoGlow: {
    position: 'absolute', top: -120, right: -130,
    width: 256, height: 256, borderRadius: 500,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  emeraldGlow: {
    position: 'absolute', bottom: -100, left: -50,
    width: 192, height: 192, borderRadius: 96,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  safeArea: { flex: 1 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
  profileHeader: {
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 46,
  },
  companyIconLarge: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: '#0F172A', borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  companyName: {
    color: '#94A3B8', fontSize: 13, fontWeight: '600',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  roleName: {
    color: '#FFFFFF', fontSize: 22, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 12, paddingHorizontal: 20,
  },
  statusPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 14 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', gap: 10 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  metaText: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  scrollContent: { paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    marginHorizontal: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 2,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 'bold', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  infoIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  infoText: { flex: 1 },
  infoLabel: { color: '#94A3B8', fontSize: 11, marginBottom: 2 },
  infoValue: { color: '#111827', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4, marginLeft: 50 },
  jdText: { color: '#4B5563', fontSize: 14, lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: '#161C33', borderRadius: 18,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 }, shadowRadius: 12,
  },
  applyButton: {
    flexDirection: 'row', paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  applyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
