import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_JOBS = [
  { id: '1', role: 'Senior Frontend Engineer', company: 'Emerson', status: 'Email Sent', referrer: 'Nitin Pansare' },
  { id: '2', role: 'Software Engineer II', company: 'Amazon', status: 'Pending AI Draft', referrer: 'Yogesh' },
];

export default function JobsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827', '#0F172A']}
        style={styles.headerBackground}
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Target Jobs</Text>
          <TouchableOpacity>
            <Feather name="plus-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_JOBS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.jobCard}>
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
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
