import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const MOCK_REFERRALS = [
  { id: '1', name: 'Nitin Pansare', role: 'Assoc. Director Quality at Emerson', time: '2h', status: 'Accepted' },
  { id: '2', name: 'Yogesh', role: 'Software Developer at Amazon', time: '1d', status: 'Accepted' },
  { id: '3', name: 'Bhavik Mer', role: 'Vice President at Bank of America', status: 'Pending' },
  { id: '4', name: 'Ajay Joshi', role: 'Global Tech Lead at Citi Bank', status: 'No Response' },
  { id: '5', name: 'Giridhar Sivaramakrishnan', role: 'Scrum Master at Bank of America', status: 'Declined' },
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
        colors={['#1F2937', '#111827', '#0F172A']}
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
            <Feather name="search" size={18} color="#8E9BB3" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search for a referral..."
              placeholderTextColor="#8E9BB3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Feather name="menu" size={18} color="#8E9BB3" />
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
              <View style={styles.referralAvatarPlaceholder}>
                <Feather name="user" size={20} color="#8E9BB3" />
              </View>
              <View style={styles.referralInfo}>
                <View style={styles.referralHeader}>
                  <Text style={styles.referralName}>{item.name}</Text>
                  {item.time && <Text style={styles.referralTime}>{item.time}</Text>}
                </View>
                <Text style={styles.referralRole} numberOfLines={1}>{item.role}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
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
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
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
  referralRole: {
    color: '#6B7280',
    fontSize: 12,
  },
});
