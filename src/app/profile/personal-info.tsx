import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, User, Briefcase, Phone, MapPin, Globe } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchUserProfile, updateUserProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function LinkedinIcon({ size = 18, color = '#9CA3AF', style }: { size?: number; color?: string; style?: any }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <Path d="M2 9h4v12H2z" />
      <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </Svg>
  );
}

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      if (profile) {
        setName(profile.name || '');
        setRole(profile.role || '');
        setPhone(profile.phone || '');
        setLocation(profile.location || '');
        setWebsite(profile.website || '');
        setLinkedin(profile.linkedin || '');
      }
    } catch (error) {
      console.error('Failed to load profile', error);
      if (user) {
        setName(user.name || '');
        setRole(user.role || '');
        setPhone(user.phone || '');
        setLocation(user.location || '');
        setWebsite(user.website || '');
        setLinkedin(user.linkedin || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim(),
        location: location.trim(),
        website: website.trim(),
        linkedin: linkedin.trim(),
      });
      await refreshUser();
      router.back();
    } catch (error) {
      console.error('Failed to save profile', error);
      Alert.alert('Save failed', 'Could not save your profile. Make sure the API server is running.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Personal Info</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.inputWrapper}>
                <Briefcase size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website</Text>
              <View style={styles.inputWrapper}>
                <Globe size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={website}
                  onChangeText={setWebsite}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>LinkedIn</Text>
              <View style={styles.inputWrapper}>
                <LinkedinIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={linkedin}
                  onChangeText={setLinkedin}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActionContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  indigoGlow: { position: 'absolute', top: -120, right: -130, width: 256, height: 256, borderRadius: 128, backgroundColor: 'rgba(99, 102, 241, 0.18)' },
  emeraldGlow: { position: 'absolute', bottom: -60, left: -50, width: 192, height: 192, borderRadius: 96, backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 32 },
  backButton: { padding: 8, marginLeft: -8 },
  pageTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 100 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.02, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 52 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#111827', fontSize: 16, fontWeight: '500' },
  bottomActionContainer: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#161C33', borderRadius: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: -4 }, shadowRadius: 10 },
  saveButton: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
