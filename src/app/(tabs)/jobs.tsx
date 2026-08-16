import { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Animated, PanResponder } from 'react-native';
import { PlusCircle, Search, Menu, Briefcase, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { deleteJob, fetchJobs } from '../../services/api';
import { EmptyState } from '../../components/EmptyState';


export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [])
  );

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs', error);
    } finally {
      setLoading(false);
    }
  };

  let filteredJobs = jobs.filter(job => {
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


  const renderEmpty = () => {
    if (jobs.length === 0) {
      return (
        <EmptyState
          icon="briefcase"
          title="No jobs added yet"
          subtitle="Track the roles you're applying for and connect them with referrals from your network."
          actionLabel="Add your first job"
          onAction={() => router.push('/add-job')}
        />
      );
    }
    return (
      <EmptyState
        icon="search"
        title="No matches found"
        subtitle="Try adjusting your search or filters to find a job."
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
        <View style={styles.indigoGlow} />
        <View style={styles.emeraldGlow} />
      </View>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Fixed Header */}
        <View style={styles.fixedHeaderContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.pageTitle}>Target Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/add-job')}>
              <PlusCircle size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={18} color="rgba(199, 210, 254, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a job..."
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
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, filteredJobs.length === 0 && styles.listContentEmpty]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.jobCard} onPress={() => router.push(`/job/${item.id}`)}>
                <View style={styles.jobContent}>
                  <View style={styles.jobHeader}>
                    <View style={styles.companyIconPlaceholder}>
                      <Briefcase size={20} color="#8E9BB3" />
                    </View>
                    <View style={styles.jobTitleContainer}>
                      <Text style={styles.jobRole}>{item.role}</Text>
                      <Text style={styles.jobCompany}>{item.company}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.jobFooter}>
                    <View style={styles.referrerInfo}>
                      <User size={14} color="#6B7280" />
                      <Text style={styles.referrerName}>{item.referrer}</Text>
                    </View>
                    <View style={[styles.statusPill, item.status === 'Email Sent' ? styles.statusSent : styles.statusPending]}>
                      <Text style={[styles.statusText, item.status === 'Email Sent' ? styles.statusTextSent : styles.statusTextPending]}>
                        {item.status}
                      </Text>
                    </View>
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
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  jobContent: {
    flex: 1,
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
