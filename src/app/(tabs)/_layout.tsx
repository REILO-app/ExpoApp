import { Tabs, usePathname, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_MARGIN = SCREEN_WIDTH * 0.1;
const BAR_WIDTH = SCREEN_WIDTH - HORIZONTAL_MARGIN * 2;
const TAB_COUNT = 4;
const CIRCLE_SIZE = 44;
const TAB_SLOT = BAR_WIDTH / TAB_COUNT;
// Center of circle within its tab slot
const circleOffset = TAB_SLOT / 2 - CIRCLE_SIZE / 2;

const TABS = [
  { name: 'index',    route: '/',          icon: 'grid'      },
  { name: 'referrals', route: '/referrals', icon: 'users'     },
  { name: 'jobs',     route: '/jobs',       icon: 'briefcase' },
  { name: 'profile',  route: '/profile',    icon: 'user'      },
] as const;

function getTabIndex(pathname: string): number {
  if (pathname === '/' || pathname === '/index') return 0;
  if (pathname.startsWith('/referrals')) return 1;
  if (pathname.startsWith('/jobs')) return 2;
  if (pathname.startsWith('/profile')) return 3;
  return 0;
}

function CustomTabBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const insets   = useSafeAreaInsets();

  const activeIndex = getTabIndex(pathname);
  const slideX = useRef(new Animated.Value(activeIndex * TAB_SLOT + circleOffset)).current;

  useEffect(() => {
    Animated.spring(slideX, {
      toValue: activeIndex * TAB_SLOT + circleOffset,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();
  }, [activeIndex]);

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom + 8, 24) }]}>
      <View style={styles.bar}>
        {/* Sliding white circle — single element that moves */}
        <Animated.View
          style={[styles.slidingCircle, { transform: [{ translateX: slideX }] }]}
        />

        {/* Tab buttons */}
        {TABS.map((tab, idx) => {
          const focused = activeIndex === idx;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.85}
            >
              <Feather
                name={tab.icon as any}
                size={21}
                color={focused ? '#161C33' : '#8E9BB3'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <CustomTabBar />}
    >
      <Tabs.Screen name="index"    />
      <Tabs.Screen name="referrals" />
      <Tabs.Screen name="jobs"     />
      <Tabs.Screen name="profile"  />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: BAR_WIDTH,
    height: 64,
    backgroundColor: '#161C33',
    borderRadius: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  slidingCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    top: (64 - CIRCLE_SIZE) / 2,
    left: 0,
    zIndex: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  tab: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
