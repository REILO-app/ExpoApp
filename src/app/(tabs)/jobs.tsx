import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const MOCK_JOBS = [
  { id: '1', role: 'Senior Frontend Engineer', company: 'Emerson', time: '2h', status: 'Email Sent', statusColor: '#059669', statusBg: '#ECFDF5', statusBorder: '#D1FAE5', dotColor: '#10B981', referrer: 'Nitin Pansare' },
  { id: '2', role: 'Software Engineer II', company: 'Amazon', time: '1d', status: 'Pending AI Draft', statusColor: '#D97706', statusBg: '#FFFBEB', statusBorder: '#FEF3C7', dotColor: '#FBBF24', referrer: 'Yogesh' },
];

export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  let filteredJobs = MOCK_JOBS.filter(job => {
    const matchesFilter = activeFilter === 'All' || job.status === activeFilter;
    const matchesSearch = job.role.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (sortOrder) {
    filteredJobs = filteredJobs.sort((a, b) => {
      if (sortOrder === 'asc') return a.company.localeCompare(b.company);
      return b.company.localeCompare(a.company);
    });
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
        <BlurView intensity={20} tint="dark" style={styles.indigoGlow} />
        <BlurView intensity={20} tint="dark" style={styles.emeraldGlow} />
      </View>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Fixed Header */}
        <View style={styles.fixedHeaderContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.pageTitle}>Target Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/add-job')}>
              <Feather name="plus-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="rgba(199, 210, 254, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a job..."
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
              <Text style={styles.filterMenuTitle}>Sort By Company</Text>
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
                {['All', 'Email Sent', 'Pending AI Draft'].map(f => (
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
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.jobCard} onPress={() => router.push(`/job/${item.id}`)}>
              <View style={styles.jobHeader}>
                <View style={styles.companyIconPlaceholder}>
                  <Feather name="briefcase" size={20} color="#8E9BB3" />
                </View>
                <View style={styles.jobTitleContainer}>
                  <Text style={styles.jobRole}>{item.role}</Text>
                  <Text style={styles.jobCompany}>{item.company}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.jobFooter}>
                <View style={styles.referrerInfo}>
                  <Feather name="user" size={14} color="#6B7280" />
                  <Text style={styles.referrerName}>{item.referrer}</Text>
                </View>
                <View style={[styles.statusPill, item.status === 'Email Sent' ? styles.statusSent : styles.statusPending]}>
                  <Text style={[styles.statusText, item.status === 'Email Sent' ? styles.statusTextSent : styles.statusTextPending]}>
                    {item.status}
                  </Text>
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
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referrerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  referrerName: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSent: {
    backgroundColor: '#D1FAE5',
  },
  statusTextSent: {
    color: '#059669',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
