import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  const MOCK_NOTIFICATIONS = [
    { id: '1', title: 'Connection Request Accepted!', message: 'Nitin Pansare accepted your connection request.', time: '2m ago', type: 'success' },
    { id: '2', title: 'Referral Request Approved!', message: 'Hurray! Nitin Pansare has referred you for the job!', time: '1h ago', type: 'success' },
    { id: '3', title: 'Connection Request Sent', message: 'You sent a connection request to Bhavik Mer.', time: '1d ago', type: 'info' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>

        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <View style={[styles.iconContainer, item.type === 'success' ? styles.iconSuccess : styles.iconInfo]}>
                <Feather 
                  name={item.type === 'success' ? 'check-circle' : 'info'} 
                  size={20} 
                  color={item.type === 'success' ? '#059669' : '#3B82F6'} 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            </View>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 20,
  },
  notificationCard: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconSuccess: {
    backgroundColor: '#D1FAE5',
  },
  iconInfo: {
    backgroundColor: '#DBEAFE',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
