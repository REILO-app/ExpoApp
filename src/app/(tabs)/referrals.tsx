import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const MOCK_REFERRALS = [
  { id: '1', name: 'Nitin Pansare', role: 'Assoc. Director', time: '2h', status: 'Accepted', statusColor: '#059669', statusBg: '#ECFDF5', statusBorder: '#D1FAE5', dotColor: '#10B981' },
  { id: '2', name: 'Yogesh', role: 'Software Dev', time: '1d', status: 'Accepted', statusColor: '#059669', statusBg: '#ECFDF5', statusBorder: '#D1FAE5', dotColor: '#10B981' },
  { id: '3', name: 'Bhavik Mer', role: 'VP Engineering', time: '3d', status: 'Pending', statusColor: '#D97706', statusBg: '#FFFBEB', statusBorder: '#FEF3C7', dotColor: '#FBBF24' },
  { id: '4', name: 'Ajay Joshi', role: 'Global Tech Lead', time: '4d', status: 'No Response', statusColor: '#64748B', statusBg: '#F8FAFC', statusBorder: '#E2E8F0', dotColor: '#CBD5E1' },
  { id: '5', name: 'Giridhar S.', role: 'Software Dev', time: '1w', status: 'Declined', statusColor: '#E11D48', statusBg: '#FFF1F2', statusBorder: '#FFE4E6', dotColor: '#F43F5E' },
];

export default function ReferralsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredReferrals = MOCK_REFERRALS.filter(ref => {
    return ref.name.toLowerCase().includes(searchQuery.toLowerCase()) || ref.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E1B4B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Fixed Header */}
        <View style={styles.fixedHeaderContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.pageTitle}>Added Referrals</Text>
            <TouchableOpacity onPress={() => router.push('/add-referral')}>
              <Feather name="plus-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="rgba(199, 210, 254, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a referral..."
              placeholderTextColor="rgba(199, 210, 254, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Feather name="menu" size={18} color="rgba(199, 210, 254, 0.6)" />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={styles.filterMenu}>
              <Text style={styles.filterMenuTitle}>Filter By Status</Text>
              <View style={styles.filterMenuOptions}>
                {['Pending', 'Accepted', 'Declined', 'No Response'].map(f => (
                  <TouchableOpacity key={f} style={styles.filterMenuBtn}>
                    <Text style={styles.filterMenuBtnText}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* List Items */}
        <FlatList
          data={filteredReferrals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.referralCard} onPress={() => router.push(`/referral/${item.id}`)}>
              <View style={styles.avatarContainer}>
                <View style={styles.referralAvatarPlaceholder}>
                  <Feather name="user" size={20} color="#8E9BB3" />
                </View>
                <View style={[styles.statusDot, { borderColor: '#FFFFFF', backgroundColor: item.dotColor }]} />
              </View>

              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{item.name}</Text>
                <Text style={styles.referralRole} numberOfLines={1}>{item.role}</Text>
              </View>

              <View style={styles.referralRight}>
                <Text style={styles.referralTime}>{item.time}</Text>
                <View style={[styles.statusPill, { backgroundColor: item.statusBg, borderColor: item.statusBorder, borderWidth: 1 }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

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
    height: 220,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  fixedHeaderContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  filterMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  filterMenuTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  filterMenuOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterMenuBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterMenuBtnText: {
    fontSize: 12,
    color: '#4B5563',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // For floating tab bar
  },
  referralCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  referralAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  referralInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  referralName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  referralRole: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  referralRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  referralTime: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
