import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const FILTERS = ['All', 'Pending', 'Accepted', 'Declined', 'No Response'];

const MOCK_REFERRALS = [
  { id: '1', name: 'Nitin Pansare', role: 'Assoc. Director Quality at Emerson', time: '2h', status: 'Accepted', statusColor: '#059669', statusBg: '#D1FAE5' },
  { id: '2', name: 'Yogesh', role: 'Software Developer at Amazon', time: '1d', status: 'Accepted', statusColor: '#059669', statusBg: '#D1FAE5' },
  { id: '3', name: 'Bhavik Mer', role: 'Vice President at Bank of America', status: 'Pending', statusColor: '#D97706', statusBg: '#FEF3C7' },
  { id: '4', name: 'Ajay Joshi', role: 'Global Tech Lead at Citi Bank', status: 'No Response', statusColor: '#6B7280', statusBg: '#F3F4F6' },
  { id: '5', name: 'Giridhar Sivaramakrishnan', role: 'Scrum Master at Bank of America', status: 'Declined', statusColor: '#DC2626', statusBg: '#FEE2E2' },
  { id: '6', name: 'John Doe', role: 'Software Engineer at Google', time: '2d', status: 'Accepted', statusColor: '#059669', statusBg: '#D1FAE5' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReferrals = MOCK_REFERRALS.filter(ref => {
    const matchesFilter = activeFilter === 'All' || ref.status === activeFilter;
    const matchesSearch = ref.name.toLowerCase().includes(searchQuery.toLowerCase()) || ref.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Recently Added Referrals</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827', '#0F172A']}
        style={styles.headerBackground}
      />
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
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.userName}>Prasad Pansare</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/notifications')}>
              <Feather name="bell" size={20} color="#1A223B" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#8E9BB3" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search for a referral..."
              placeholderTextColor="#8E9BB3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Networking Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Referrals</Text>
                <Text style={styles.statValue}>8</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Approved</Text>
                <Text style={styles.statValue}>8</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>8</Text>
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
        <FlatList
          data={filteredReferrals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.referralCard} onPress={() => router.push(`/referral/${item.id}`)}>
              <View style={styles.referralAvatarPlaceholder}>
                <Feather name="user" size={20} color="#8E9BB3" />
              </View>
              <View style={styles.referralInfo}>
                <View style={styles.referralHeader}>
                  <Text style={styles.referralName}>{item.name}</Text>
                  {item.time && <Text style={styles.referralTime}>{item.time}</Text>}
                </View>
                <View style={styles.referralFooter}>
                  <Text style={styles.referralRole} numberOfLines={1}>{item.role}</Text>
                  <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                    <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                  </View>
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
    height: 320,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
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
    backgroundColor: '#E5E7EB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: '#8E9BB3',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bellIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#8E9BB3',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
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
    paddingBottom: 100, // For floating tab bar
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referralCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  referralAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  referralName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referralTime: {
    color: '#8E9BB3',
    fontSize: 12,
  },
  referralFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralRole: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
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
