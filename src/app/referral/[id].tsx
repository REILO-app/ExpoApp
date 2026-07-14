import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function ReferralDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={['#080d18ff', '#080d18ff', '#1E293B', '#1E1B4B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={20} tint="dark" style={styles.indigoGlow} />
        <BlurView intensity={20} tint="dark" style={styles.emeraldGlow} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header Profile */}
        <View style={styles.profileHeader}>
          <View style={styles.largeAvatarPlaceholder} />
          <Text style={styles.profileName}>Nitin Pansare</Text>
          <Text style={styles.profileRole}>Associate Director Quality . Emerson</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Referral Accepted</Text>
          </View>
          <View style={styles.socialIcons}>
            <View style={styles.socialIcon}><Feather name="linkedin" size={16} color="#FFFFFF" /></View>
            <View style={styles.socialIcon}><Feather name="mail" size={16} color="#FFFFFF" /></View>
            <View style={styles.socialIcon}><Feather name="phone" size={16} color="#FFFFFF" /></View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            {/* Contact Info */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Contact Information</Text>
                <Text style={styles.editButton}>Edit</Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="briefcase" size={18} color="#8E9BB3" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Company</Text>
                  <Text style={styles.infoValue}>Emerson</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="user" size={18} color="#8E9BB3" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>Associate Director Quality, India</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="map-pin" size={18} color="#8E9BB3" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>Pune, MH, India</Text>
                </View>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notes</Text>
              <Text style={styles.notesText}>
                He is my father, and he is willing to refer me. I have proved myself to him that i am worth it. So he is willing to refer to any upcoming jobs
              </Text>
            </View>

            {/* Referral History */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Referral History</Text>
                <Text style={styles.eventsCount}>4 events</Text>
              </View>

              <View style={styles.historyTimeline}>
                <View style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: '#FEE2E2' }]}>
                    <Feather name="send" size={12} color="#DC2626" />
                  </View>
                  <View style={styles.historyLine} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Connection Request Sent</Text>
                    <Text style={styles.historyDesc}>Connection Request was sent on June 7 2026</Text>
                  </View>
                </View>

                <View style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: '#D1FAE5' }]}>
                    <Feather name="user-check" size={12} color="#059669" />
                  </View>
                  <View style={styles.historyLine} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Connection Request Accepted!</Text>
                    <Text style={styles.historyDesc}>Nitin Pansare accepted your connection request!</Text>
                  </View>
                </View>

                <View style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: '#FEF3C7' }]}>
                    <Feather name="mail" size={12} color="#D97706" />
                  </View>
                  <View style={styles.historyLine} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Referral Request Sent</Text>
                    <Text style={styles.historyDesc}>Referral request for SDE 1 role at Emerson was sent to Nitin Pansare</Text>
                  </View>
                </View>

                <View style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: '#E0E7FF' }]}>
                    <Feather name="check-circle" size={12} color="#4338CA" />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Referral Request Approved!</Text>
                    <Text style={styles.historyDesc}>Hurray! Nitin Pansare has referred you for the job! All the best for your application!</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Ask for Referral Button */}
        <View style={styles.bottomActionContainer}>
          <TouchableOpacity
            style={styles.askReferralButton}
            onPress={() => router.push(`/ask-referral?referralId=${id}`)}
          >
            <Text style={styles.askReferralButtonText}>Ask for Referral</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 340,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  indigoGlow: {
    position: 'absolute',
    top: -120,
    right: -130,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  emeraldGlow: {
    position: 'absolute',
    bottom: -60,
    left: -50,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  largeAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    color: '#8E9BB3',
    fontSize: 14,
    marginBottom: 12,
  },
  statusPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: 'bold',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editButton: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsCount: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoLabel: {
    color: '#8E9BB3',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  notesText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  historyTimeline: {
    paddingLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  historyIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  historyLine: {
    position: 'absolute',
    top: 24,
    left: 11,
    width: 2,
    height: '120%',
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  historyContent: {
    flex: 1,
    marginLeft: 16,
  },
  historyTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyDesc: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1A223B',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
  },
  askReferralButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askReferralButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
