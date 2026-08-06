import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { BlurView } from 'expo-blur';
import { fetchReferrals } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';

const FILTERS = ['All', 'Pending', 'Accepted', 'Rejected', 'No Response'];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredReferrals = referrals.filter(ref => {
    const normalizedStatus = ref.status === 'Declined' ? 'Rejected' : ref.status;
    const matchesFilter = activeFilter === 'All' || normalizedStatus === activeFilter;
    const matchesSearch = ref.name.toLowerCase().includes(searchQuery.toLowerCase()) || ref.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Recent Referrals</Text>
    </View>
  );

  const renderEmpty = () => {
    if (referrals.length === 0) {
      return (
        <EmptyState
          icon="users"
          title="No referrals yet"
          subtitle="Add people from your network who can refer you to jobs at their company."
          actionLabel="Add your first referral"
          onAction={() => router.push('/add-referral')}
        />
      );
    }
    return (
      <EmptyState
        icon="search"
        title="No matches found"
        subtitle="Try adjusting your search or filter to find what you're looking for."
      />
    );
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
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Fixed Top Section */}
        <View style={styles.fixedHeaderContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={24} color="#8E9BB3" />
              </View>
              <View>
                <Text style={styles.greeting}>Welcome back</Text>
                <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/notifications')}>
              <Feather name="bell" size={20} color="#FFFFFF" />
              <View style={styles.bellBadge} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="rgba(199, 210, 254, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find a referral..."
              placeholderTextColor="rgba(199, 210, 254, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Network Overview</Text>
              <View style={styles.statsBadge}>
                <Feather name="trending-up" size={12} color="#059669" />
                <Text style={styles.statsBadgeText}>+12%</Text>
              </View>
            </View>

            <View style={styles.statsRowWrapper}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: '#94A3B8' }]}>Total</Text>
                <Text style={[styles.statValue, { color: '#0F172A' }]}>{referrals.length}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: '#818CF8' }]}>Active</Text>
                <Text style={[styles.statValue, { color: '#4F46E5' }]}>{referrals.filter(r => r.status === 'Pending').length}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: '#F59E0B' }]}>Pending</Text>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{referrals.filter(r => r.status === 'Pending').length}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: '#10B981' }]}>Success</Text>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{referrals.length > 0 ? Math.round((referrals.filter(r => r.status === 'Accepted').length / referrals.length) * 100) : 0}%</Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
              {FILTERS.map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Scrollable List */}
        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredReferrals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, filteredReferrals.length === 0 && styles.listContentEmpty]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={filteredReferrals.length > 0 ? renderHeader : undefined}
          ListEmptyComponent={renderEmpty}
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
    height: 280,
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
  fixedHeaderContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: 'rgba(199, 210, 254, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  bellIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0F172A',
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
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 30,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  statsTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(209, 250, 229, 0.5)',
  },
  statsBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statsRowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.5)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    gap: 12,
    paddingRight: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  filterText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listHeader: {
    marginBottom: 8,
  },
  listTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
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