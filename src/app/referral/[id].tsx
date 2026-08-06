import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import { fetchReferralById } from '../../services/api';

export default function ReferralDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [referral, setReferral] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        const data = await fetchReferralById(id as string);
        setReferral(data);
        setName(data.name || '');
        setCompany(data.company || '');
        setRole(data.role || '');
        setLocation(data.location || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setLinkedin(data.linkedin || '');
        setNotes(data.notes || '');
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setName(tempName);
      setCompany(tempCompany);
      setRole(tempRole);
      setLocation(tempLocation);
      setEmail(tempEmail);
      setPhone(tempPhone);
      setLinkedin(tempLinkedin);
      setNotes(tempNotes);
      setIsEditing(false);
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

        {loading ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: 'white' }}>Loading...</Text>
           </View>
        ) : !referral ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: 'white' }}>Referral not found.</Text>
           </View>
        ) : (
          <>
            {/* Header Profile */}
        <View style={styles.profileHeader}>
          <View style={styles.largeAvatarPlaceholder} />
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
              <Feather name="linkedin" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => openSocialLink(`mailto:${email}`)}>
              <Feather name="mail" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => openSocialLink(`tel:${phone}`)}>
              <Feather name="phone" size={16} color="#FFFFFF" />
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
                <Feather name="briefcase" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                <Feather name="user" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                <Feather name="map-pin" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                    <Feather name="mail" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                    <Feather name="phone" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                    <Feather name="linkedin" size={18} color="#8E9BB3" style={styles.infoIcon} />
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
                    return (
                      <View key={index} style={styles.historyItem}>
                        <View style={[styles.historyIconContainer, { backgroundColor: (event.color || '#6366F1') + '1A' }]}>
                          <Feather name={(event.icon || 'clock') as any} size={12} color={event.color || '#6366F1'} />
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
});
