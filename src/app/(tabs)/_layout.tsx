import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#161C33', // Active icon color inside white circle
        tabBarInactiveTintColor: '#8E9BB3', // Inactive icon color
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Feather name="grid" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="referrals"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Feather name="users" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Feather name="briefcase" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
              <Feather name="user" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#161C33',
    borderRadius: 30,
    height: 64,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    paddingBottom: 0,
  },
  tabBarItem: {
    paddingVertical: 10,
  },
  activeIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
