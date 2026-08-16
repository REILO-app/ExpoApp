import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert, Animated, Image } from 'react-native';
import {
  ChevronLeft, Trash2, Mail, Phone, Briefcase,
  User, MapPin, Clock, Send, CheckCircle, Info, LucideProps
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { fetchReferralById, fetchJobsByReferralId, deleteReferral, updateReferral } from '../../services/api';

function LinkedinIcon({ size = 18, color = '#9CA3AF', style }: { size?: number; color?: string; style?: any }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <Path d="M2 9h4v12H2z" />
      <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </Svg>
  );
}

const EVENT_ICON_MAP: Record<string, React.FC<LucideProps>> = {
  clock: Clock,
  mail: Mail,
  send: Send,
  'check-circle': CheckCircle,
  info: Info,
  user: User,
  briefcase: Briefcase,
};

// Skeleton shimmer bone component
const SkeletonBone = ({ width, height, borderRadius = 6, style, pulseAnim }: any) => (
  <Animated.View
    style={[
      {
        width,
        height,
        borderRadius,
        backgroundColor: '#E5E7EB',
        opacity: pulseAnim,
      },
      style,
    ]}
  />
);

const SkeletonLoader = ({ pulseAnim }: { pulseAnim: Animated.Value }) => (
  <>
    {/* Profile Header Skeleton */}
    <View style={styles.profileHeader}>
      <SkeletonBone width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={180} height={24} style={{ marginBottom: 8 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={140} height={14} style={{ marginBottom: 12 }} pulseAnim={pulseAnim} />
      <SkeletonBone width={80} height={28} borderRadius={14} style={{ marginBottom: 16 }} pulseAnim={pulseAnim} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBone width={32} height={32} borderRadius={16} pulseAnim={pulseAnim} />
        <SkeletonBone width={32} height={32} borderRadius={16} pulseAnim={pulseAnim} />
        <SkeletonBone width={32} height={32} borderRadius={16} pulseAnim={pulseAnim} />
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.cardsContainer}>
        {/* Contact Info Card Skeleton */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <SkeletonBone width={150} height={16} pulseAnim={pulseAnim} />
            <SkeletonBone width={36} height={16} pulseAnim={pulseAnim} />
          </View>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <SkeletonBone width={18} height={18} borderRadius={9} style={{ marginRight: 12 }} pulseAnim={pulseAnim} />
              <View>
                <SkeletonBone width={60} height={10} style={{ marginBottom: 6 }} pulseAnim={pulseAnim} />
                <SkeletonBone width={140} height={14} pulseAnim={pulseAnim} />
              </View>
            </View>
          ))}
        </View>

        {/* Notes Card Skeleton */}
        <View style={styles.card}>
          <SkeletonBone width={60} height={16} style={{ marginBottom: 12 }} pulseAnim={pulseAnim} />
          <SkeletonBone width={'100%' as any} height={12} style={{ marginBottom: 6 }} pulseAnim={pulseAnim} />
          <SkeletonBone width={'75%' as any} height={12} pulseAnim={pulseAnim} />
        </View>

        {/* History Card Skeleton */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <SkeletonBone width={130} height={16} pulseAnim={pulseAnim} />
            <SkeletonBone width={50} height={14} pulseAnim={pulseAnim} />
          </View>
          {[1, 2].map((i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 20 }}>
              <SkeletonBone width={24} height={24} borderRadius={12} style={{ marginRight: 16 }} pulseAnim={pulseAnim} />
              <View>
                <SkeletonBone width={120} height={14} style={{ marginBottom: 6 }} pulseAnim={pulseAnim} />
                <SkeletonBone width={200} height={12} pulseAnim={pulseAnim} />
              </View>
            </View>
          ))}
        </View>

        {/* Jobs Referred Card Skeleton */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <SkeletonBone width={110} height={16} pulseAnim={pulseAnim} />
            <SkeletonBone width={40} height={14} pulseAnim={pulseAnim} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
            <SkeletonBone width={36} height={36} borderRadius={10} style={{ marginRight: 12 }} pulseAnim={pulseAnim} />
            <View style={{ flex: 1 }}>
              <SkeletonBone width={130} height={14} style={{ marginBottom: 4 }} pulseAnim={pulseAnim} />
              <SkeletonBone width={100} height={12} pulseAnim={pulseAnim} />
            </View>
            <SkeletonBone width={70} height={22} borderRadius={11} pulseAnim={pulseAnim} />
          </View>
        </View>
      </View>
    </ScrollView>
  </>
);

export default function ReferralDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [referral, setReferral] = useState<any>(null);
  const [referralJobs, setReferralJobs] = useState<any[]>([]);
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

  // Primary Editable Profile States
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadReferral = async () => {
      try {
        // Fire both requests in parallel
        const [referralResult, jobsResult] = await Promise.allSettled([
          fetchReferralById(id as string),
          fetchJobsByReferralId(id as string),
        ]);

        if (referralResult.status === 'fulfilled') {
          const data = referralResult.value;
          setReferral(data);
          setName(data.name || '');
          setCompany(data.company || '');
          setRole(data.role || '');
          setLocation(data.location || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setLinkedin(data.linkedin || '');
          setNotes(data.notes || '');
        }

        if (jobsResult.status === 'fulfilled') {
          setReferralJobs(jobsResult.value);
        } else {
          console.warn('Could not load referral jobs:', jobsResult.reason);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadReferral();
  }, [id]);

  // Edit Toggles & Temporary State
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempCompany, setTempCompany] = useState(company);
  const [tempRole, setTempRole] = useState(role);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempLinkedin, setTempLinkedin] = useState(linkedin);
  const [tempNotes, setTempNotes] = useState(notes);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Save changes to database
        const updated = await updateReferral(id as string, {
          name: tempName,
          company: tempCompany,
          role: tempRole,
          location: tempLocation,
          email: tempEmail,
          phone: tempPhone,
          linkedin: tempLinkedin,
          notes: tempNotes,
        });

        setName(updated.name || tempName);
        setCompany(updated.company || tempCompany);
        setRole(updated.role || tempRole);
        setLocation(updated.location || tempLocation);
        setEmail(updated.email || tempEmail);
        setPhone(updated.phone || tempPhone);
        setLinkedin(updated.linkedin || tempLinkedin);
        setNotes(updated.notes || tempNotes);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update referral', error);
        Alert.alert('Error', 'Failed to save changes. Make sure the API server is running.');
      }
    } else {
      // Enter edit mode
      setTempName(name);
      setTempCompany(company);
      setTempRole(role);
      setTempLocation(location);
      setTempEmail(email);
      setTempPhone(phone);
      setTempLinkedin(linkedin);
      setTempNotes(notes);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const openSocialLink = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open link'));
  };

  const handleDelete = () => {
    Alert.alert('Delete referral?', 'This will permanently remove this referral.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReferral(id as string);
            router.replace('/(tabs)/referrals');
          } catch (error) {
            console.error('Failed to delete referral', error);
            Alert.alert('Error', 'Failed to delete referral');
          }
        },
      },
    ]);
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
        <View style={styles.topActionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <SkeletonLoader pulseAnim={pulseAnim} />
        ) : !referral ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Referral not found.</Text>
          </View>
        ) : (
          <>
            {/* Header Profile */}
            <View style={styles.profileHeader}>
              <View style={styles.largeAvatarPlaceholder}>
                <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Referral')}&background=random&color=fff` }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editTitleInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Full Name"
                  placeholderTextColor="#8E9BB3"
                />
              ) : (
                <Text style={styles.profileName}>{name}</Text>
              )}
              <Text style={styles.profileRole}>
                {role.split(',')[0]} . {company}
              </Text>
              <View style={[styles.statusPill, {
                backgroundColor: referral.statusBg || '#FFFBEB',
                borderColor: referral.statusBorder || '#FEF3C7',
                borderWidth: 1,
              }]}>
                <Text style={[styles.statusText, { color: referral.statusColor || '#D97706' }]}>
                  {referral.status || 'Pending'}
                </Text>
              </View>
              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.socialIcon} onPress={() => openSocialLink(linkedin)}>
                  <LinkedinIcon size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon} onPress={() => openSocialLink(`mailto:${email}`)}>
                  <Mail size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon} onPress={() => openSocialLink(`tel:${phone}`)}>
                  <Phone size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

              {/* Cards */}
              <View style={styles.cardsContainer}>
                {/* Contact Info */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Contact Information</Text>
                    <View style={styles.editActionsWrapper}>
                      {isEditing && (
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={handleEditToggle}>
                        <Text style={styles.editButton}>
                          {isEditing ? 'Save' : 'Edit'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Company */}
                  <View style={styles.infoRow}>
                    <Briefcase size={18} color="#8E9BB3" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Company</Text>
                      {isEditing ? (
                        <TextInput style={styles.editInput} value={tempCompany} onChangeText={setTempCompany} placeholder="Company" />
                      ) : (
                        <Text style={styles.infoValue}>{company}</Text>
                      )}
                    </View>
                  </View>

                  {/* Role */}
                  <View style={styles.infoRow}>
                    <User size={18} color="#8E9BB3" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Role</Text>
                      {isEditing ? (
                        <TextInput style={styles.editInput} value={tempRole} onChangeText={setTempRole} placeholder="Role" />
                      ) : (
                        <Text style={styles.infoValue}>{role}</Text>
                      )}
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.infoRow}>
                    <MapPin size={18} color="#8E9BB3" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Location</Text>
                      {isEditing ? (
                        <TextInput style={styles.editInput} value={tempLocation} onChangeText={setTempLocation} placeholder="Location" />
                      ) : (
                        <Text style={styles.infoValue}>{location}</Text>
                      )}
                    </View>
                  </View>

                  {/* Extended Contact Fields - Visible ONLY during edit mode */}
                  {isEditing && (
                    <>
                      <View style={styles.infoRow}>
                        <Mail size={18} color="#8E9BB3" style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>Email (Hidden on card when saved)</Text>
                          <TextInput
                            style={styles.editInput}
                            value={tempEmail}
                            onChangeText={setTempEmail}
                            placeholder="Email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <Phone size={18} color="#8E9BB3" style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>Phone (Hidden on card when saved)</Text>
                          <TextInput
                            style={styles.editInput}
                            value={tempPhone}
                            onChangeText={setTempPhone}
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                          />
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <LinkedinIcon size={18} color="#8E9BB3" style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>LinkedIn Profile (Hidden on card when saved)</Text>
                          <TextInput
                            style={styles.editInput}
                            value={tempLinkedin}
                            onChangeText={setTempLinkedin}
                            placeholder="https://linkedin.com/in/..."
                            autoCapitalize="none"
                          />
                        </View>
                      </View>
                    </>
                  )}
                </View>

                {/* Notes */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Notes</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.editInput, styles.textArea]}
                      value={tempNotes}
                      onChangeText={setTempNotes}
                      multiline
                      placeholder="Notes"
                    />
                  ) : (
                    <Text style={styles.notesText}>{notes}</Text>
                  )}
                </View>

                {/* Referral History */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Referral History</Text>
                    <Text style={styles.eventsCount}>{referral.history?.length || 0} events</Text>
                  </View>

                  <View style={styles.historyTimeline}>
                    {(!referral.history || referral.history.length === 0) ? (
                      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#6B7280', fontSize: 14 }}>No events yet</Text>
                      </View>
                    ) : (
                      referral.history.map((event: any, index: number) => {
                        const isLast = index === referral.history.length - 1;
                        const EventIcon = EVENT_ICON_MAP[event.icon] || Clock;
                        return (
                          <View key={index} style={styles.historyItem}>
                            <View style={[styles.historyIconContainer, { backgroundColor: (event.color || '#6366F1') + '1A' }]}>
                              <EventIcon size={12} color={event.color || '#6366F1'} />
                            </View>
                            {!isLast && <View style={styles.historyLine} />}
                            <View style={styles.historyContent}>
                              <Text style={styles.historyTitle}>{event.title}</Text>
                              <Text style={styles.historyDesc}>
                                {event.description}
                                {event.timestamp && ` • ${new Date(event.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Jobs Referred</Text>
                    <Text style={styles.eventsCount}>{referralJobs.length} job{referralJobs.length !== 1 ? 's' : ''}</Text>
                  </View>
                  {referralJobs.length === 0 ? (
                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                      <Briefcase size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                      <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No jobs linked to this referrer yet</Text>
                    </View>
                  ) : (
                    referralJobs.map((job: any, index: number) => (
                      <TouchableOpacity
                        key={job.id || index}
                        style={[
                          styles.jobRow,
                          index < referralJobs.length - 1 && styles.jobRowBorder,
                        ]}
                        onPress={() => router.push(`/job/${job.id}`)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.jobIconContainer, { backgroundColor: (job.statusBg || '#EEF2FF') }]}>
                          <Briefcase size={16} color={job.statusColor || '#6366F1'} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.jobTitle}>{job.role}</Text>
                          <Text style={styles.jobCompany}>{job.company}{job.location ? ` · ${job.location}` : ''}</Text>
                        </View>
                        <View style={[styles.jobStatusPill, { backgroundColor: job.statusBg || '#EEF2FF', borderColor: job.statusBorder || '#C7D2FE' }]}>
                          <View style={[styles.jobStatusDot, { backgroundColor: job.dotColor || '#6366F1' }]} />
                          <Text style={[styles.jobStatusText, { color: job.statusColor || '#6366F1' }]}>{job.status}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>



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
          </>
        )}
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
  topActionsRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
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
  editActionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    color: '#111827',
    fontSize: 14,
    fontWeight: 'bold',
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
    marginBottom: 4,
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
    backgroundColor: '#F1F5F9',
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
  editTitleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    textAlign: 'center',
    width: '80%',
  },
  editInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  jobRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  jobIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  jobTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  jobCompany: {
    color: '#6B7280',
    fontSize: 12,
  },
  jobStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  jobStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  jobStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
