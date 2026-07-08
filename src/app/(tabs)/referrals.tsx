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
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  let filteredReferrals = MOCK_REFERRALS.filter(ref => {
    const matchesFilter = activeFilter === 'All' || ref.status === activeFilter;
    const matchesSearch = ref.name.toLowerCase().includes(searchQuery.toLowerCase()) || ref.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (sortOrder) {
    filteredReferrals = filteredReferrals.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }

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
              <Text style={styles.filterMenuTitle}>Sort By Name</Text>
              <View style={styles.filterMenuOptions}>
                <TouchableOpacity style={styles.filterMenuBtn} onPress={() => { setSortOrder('asc'); setShowFilters(false); }}>
                  <Text style={[styles.filterMenuBtnText, sortOrder === 'asc' && { color: '#4F46E5', fontWeight: 'bold' }]}>A -> Z</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterMenuBtn} onPress={() => { setSortOrder('desc'); setShowFilters(false); }}>
                  <Text style={[styles.filterMenuBtnText, sortOrder === 'desc' && { color: '#4F46E5', fontWeight: 'bold' }]}>Z -> A</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuDivider} />

              <Text style={styles.filterMenuTitle}>Filter By Status</Text>
              <View style={styles.filterMenuOptions}>
                {['All', 'Pending', 'Accepted', 'Declined', 'No Response'].map(f => (
                  <TouchableOpacity key={f} style={styles.filterMenuBtn} onPress={() => { setActiveFilter(f); setShowFilters(false); }}>
                    <Text style={[styles.filterMenuBtnText, activeFilter === f && { color: '#4F46E5', fontWeight: 'bold' }]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* List Items */}
        <FlatList
          style={{ flex: 1 }}
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
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  safeArea: {
    flex: 1,

  },
  fixedHeaderContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 30,
    zIndex: 10,
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
    position: 'absolute',
    top: 130, // Right under the search bar
    right: 20,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  filterMenuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  filterMenuOptions: {
    flexDirection: 'column',
  },
  filterMenuBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterMenuBtnText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
