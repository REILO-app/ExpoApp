import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827', '#0F172A']}
        style={styles.headerBackground}
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Profile Settings</Text>
          </View>

          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.largeAvatarPlaceholder}>
                <Feather name="user" size={40} color="#8E9BB3" />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Feather name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>Prasad Pansare</Text>
            <Text style={styles.profileRole}>Software Engineer</Text>
          </View>

          {/* Settings List */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Feather name="user" size={18} color="#4B5563" />
              </View>
              <Text style={styles.settingLabel}>Personal Information</Text>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Feather name="mail" size={18} color="#4B5563" />
              </View>
              <Text style={styles.settingLabel}>Email Address</Text>
              <Text style={styles.settingValue}>prasad@example.com</Text>
            </View>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Feather name="lock" size={18} color="#4B5563" />
              </View>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Feather name="bell" size={18} color="#4B5563" />
              </View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#161C33' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.replace('/login')}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="log-out" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.settingLabel, { color: '#DC2626' }]}>Sign Out</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="trash-2" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.settingLabel, { color: '#DC2626' }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>

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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // For floating tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  largeAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#161C33',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    color: '#6B7280',
    fontSize: 14,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 48,
  },
});
