import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { fetchJobById, deleteJob } from '../../services/api';

const SkeletonBone = ({ width, height, borderRadius = 6, style, pulseAnim }: any) => (
  <Animated.View
    style={[
      { width, height, borderRadius, backgroundColor: '#E5E7EB', opacity: pulseAnim },
      style,
    ]}
  />
);

const JobSkeletonLoader = ({ pulseAnim }: { pulseAnim: Animated.Value }) => (
  <>
    {/* Header Skeleton */}
    <View style={styles.profileHeader}>
      <SkeletonBone width={80} height={80} borderRadius={20} style={{ marginBottom: 14 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={100} height={13} style={{ marginBottom: 8 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={200} height={22} style={{ marginBottom: 12 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={90} height={28} borderRadius={14} style={{ marginBottom: 14 }} pulseAnim={pulseAnim} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SkeletonBone width={90} height={30} borderRadius={15} pulseAnim={pulseAnim} />
        <SkeletonBone width={90} height={30} borderRadius={15} pulseAnim={pulseAnim} />
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Job Details Card Skeleton */}
      <View style={styles.card}>
        <SkeletonBone width={80} height={11} style={{ marginBottom: 16 }} pulseAnim={pulseAnim} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
              <SkeletonBone width={36} height={36} borderRadius={10} style={{ marginRight: 14 }} pulseAnim={pulseAnim} />
              <View>
                <SkeletonBone width={50} height={10} style={{ marginBottom: 4 }} pulseAnim={pulseAnim} />
                <SkeletonBone width={140} height={14} pulseAnim={pulseAnim} />
              </View>
            </View>
            {i < 4 && <View style={[styles.divider, { marginLeft: 50 }]} />}
          </View>
        ))}
      </View>

      {/* Job Description Card Skeleton */}
      <View style={styles.card}>
        <SkeletonBone width={110} height={11} style={{ marginBottom: 16 }} pulseAnim={pulseAnim} />
        <SkeletonBone width={'100%' as any} height={12} style={{ marginBottom: 8 }} pulseAnim={pulseAnim} />
        <SkeletonBone width={'90%' as any} height={12} style={{ marginBottom: 8 }} pulseAnim={pulseAnim} />
        <SkeletonBone width={'95%' as any} height={12} style={{ marginBottom: 8 }} pulseAnim={pulseAnim} />
        <SkeletonBone width={'60%' as any} height={12} pulseAnim={pulseAnim} />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  </>
);

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Skeleton pulse animation
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadJob();
  }, [id]);

  if (!loading && !job) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#080d18ff' }}>
        <Text style={{ color: 'white' }}>Job not found</Text>
      </View>
    );
  }

  const handleOpenLink = () => {
    Linking.openURL(job.link).catch(() =>
      Alert.alert('Error', 'Could not open link')
    );
  };

  const handleDelete = () => {
    Alert.alert('Delete job?', 'This will permanently remove this job.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteJob(id as string);
            router.replace('/(tabs)/jobs');
          } catch (error) {
            console.error('Failed to delete job', error);
            Alert.alert('Error', 'Failed to delete job');
          }
        },
      },
    ]);
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
        {/* Top actions */}
        <View style={styles.topActionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {!loading && job && (
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Feather name="trash-2" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <JobSkeletonLoader pulseAnim={pulseAnim} />
        ) : (
          <>
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
          </>
        )}
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
  topActionsRow: {
    position: 'absolute', top: 50, left: 20, right: 20,
    zIndex: 10, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 20,
  },
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
