import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.bg.secondary,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: COLORS.text.muted,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, size }) => (
                        <View className="items-center">
                            {focused && (
                                <View
                                    className="bg-pink-hot"
                                    style={{ position: 'absolute', top: -8, width: 24, height: 2, borderRadius: 1 }}
                                />
                            )}
                            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={focused ? '#f72585' : COLORS.text.muted} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ focused, size }) => (
                        <View className="items-center">
                            {focused && (
                                <View
                                    className="bg-blue-vivid"
                                    style={{ position: 'absolute', top: -8, width: 24, height: 2, borderRadius: 1 }}
                                />
                            )}
                            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={size} color={focused ? '#4361ee' : COLORS.text.muted} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused, size }) => (
                        <View className="items-center">
                            {focused && (
                                <View
                                    className="bg-purple-vivid"
                                    style={{ position: 'absolute', top: -8, width: 24, height: 2, borderRadius: 1 }}
                                />
                            )}
                            <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={focused ? '#7209b7' : COLORS.text.muted} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
