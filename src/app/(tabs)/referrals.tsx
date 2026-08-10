import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PlusCircle, Search, Menu, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchReferrals } from '../../services/api';
import { EmptyState } from '../../components/EmptyState';

const STATUS_FILTERS = ['All', 'Pending', 'Accepted', 'Rejected', 'No Response'];

export default function ReferralsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadReferrals();
    }, [])
  );

  const loadReferrals = async () => {
    try {
      const data = await fetchReferrals();
      setReferrals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReferrals = referrals
    .filter(ref => {
      const normalizedStatus = ref.status === 'Declined' ? 'Rejected' : ref.status;
      const matchesFilter = activeFilter === 'All' || normalizedStatus === activeFilter;
      const matchesSearch = ref.name.toLowerCase().includes(searchQuery.toLowerCase()) || ref.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

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

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Fixed Header */}
        <View style={styles.fixedHeaderContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.pageTitle}>Added Referrals</Text>
            <TouchableOpacity onPress={() => router.push('/add-referral')}>
              <PlusCircle size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={18} color="rgba(199, 210, 254, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a referral..."
              placeholderTextColor="rgba(199, 210, 254, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Menu size={18} color="rgba(199, 210, 254, 0.6)" />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={styles.filterMenu}>
              <Text style={styles.filterMenuTitle}>Sort By Name</Text>
              <View style={styles.filterMenuOptions}>
                <TouchableOpacity style={styles.filterMenuBtn} onPress={() => { setSortOrder('asc'); setShowFilters(false); }}>
                  <Text style={[styles.filterMenuBtnText, sortOrder === 'asc' && { color: '#4F46E5', fontWeight: 'bold' }]}>{"A -> Z"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterMenuBtn} onPress={() => { setSortOrder('desc'); setShowFilters(false); }}>
                  <Text style={[styles.filterMenuBtnText, sortOrder === 'desc' && { color: '#4F46E5', fontWeight: 'bold' }]}>{"Z -> A"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuDivider} />

              <Text style={styles.filterMenuTitle}>Filter By Status</Text>
              <View style={styles.filterMenuOptions}>
                {['All', 'Pending', 'Accepted', 'Rejected', 'No Response'].map(f => (
                  <TouchableOpacity key={f} style={styles.filterMenuBtn} onPress={() => { setActiveFilter(f); setShowFilters(false); }}>
                    <Text style={[styles.filterMenuBtnText, activeFilter === f && { color: '#4F46E5', fontWeight: 'bold' }]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* List Items */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={filteredReferrals}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, filteredReferrals.length === 0 && styles.listContentEmpty]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="users"
                title="No referrals found"
                subtitle="Tap + above to add your first referral contact."
                actionLabel="Add Referral"
                onAction={() => router.push('/add-referral')}
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.referralCard} onPress={() => router.push(`/referral/${item.id}`)}>
                <View style={styles.avatarContainer}>
                  <View style={styles.referralAvatarPlaceholder}>
                    <User size={20} color="#8E9BB3" />
                  </View>
                  <View style={[styles.statusDot, { borderColor: '#FFFFFF', backgroundColor: item.dotColor || '#000' }]} />
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
    height: 180,
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
    borderRadius: 500,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  emeraldGlow: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
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
  listContentEmpty: {
    flexGrow: 2,
    justifyContent: 'center',
  },
  referralCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,

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
