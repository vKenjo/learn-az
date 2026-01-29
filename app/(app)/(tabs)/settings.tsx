import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
    const { signOut } = useAuth();
    const router = useRouter();
    const user = useQuery(api.users.currentUser);

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-6 py-4 border-b border-white/5">
                <Text className="text-white text-3xl font-bold">Settings</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Profile Section */}
                <TouchableOpacity
                    className="flex-row items-center p-6 border-b border-white/5 bg-bg-secondary"
                    onPress={() => router.push("/(app)/settings/profile")}
                >
                    <View className="w-16 h-16 rounded-full bg-pink-hot/20 items-center justify-center mr-4">
                        <Text className="text-pink-hot text-2xl font-bold">
                            {user?.profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">{user?.profile?.name || "User"}</Text>
                        <Text className="text-text-secondary">{user?.email}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.text.muted} />
                </TouchableOpacity>

                {/* Content Management */}
                <View className="px-6 pb-6">
                    <Text className="text-pink-hot font-bold mb-4 uppercase text-xs tracking-wider">Content Management</Text>
                    <View className="bg-bg-secondary rounded-2xl overflow-hidden mb-2">
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-4"
                            onPress={() => router.push('/(app)/admin/add-question')}
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center mr-3">
                                    <Ionicons name="add-circle" size={16} color="#22c55e" />
                                </View>
                                <Text className="text-white font-medium">Add New Question</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.text.muted} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences */}
                <View className="p-6">
                    <Text className="text-pink-hot font-bold mb-4 uppercase text-xs tracking-wider">Preferences</Text>

                    <View className="bg-bg-secondary rounded-2xl overflow-hidden">
                        <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mr-3">
                                    <Ionicons name="musical-notes" size={16} color="#3b82f6" />
                                </View>
                                <Text className="text-white font-medium">Sound Effects</Text>
                            </View>
                            <Switch
                                value={soundEnabled}
                                onValueChange={setSoundEnabled}
                                trackColor={{ false: '#333', true: COLORS.pink.hot }}
                            />
                        </View>
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-purple-500/20 items-center justify-center mr-3">
                                    <Ionicons name="phone-portrait" size={16} color="#a855f7" />
                                </View>
                                <Text className="text-white font-medium">Haptic Feedback</Text>
                            </View>
                            <Switch
                                value={hapticsEnabled}
                                onValueChange={setHapticsEnabled}
                                trackColor={{ false: '#333', true: COLORS.pink.hot }}
                            />
                        </View>
                    </View>
                </View>

                {/* Support */}
                <View className="px-6 pb-6">
                    <Text className="text-pink-hot font-bold mb-4 uppercase text-xs tracking-wider">Support</Text>

                    <View className="bg-bg-secondary rounded-2xl overflow-hidden mb-8">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-white/5">
                            <Text className="text-white font-medium">Help Center</Text>
                            <Ionicons name="open-outline" size={20} color={COLORS.text.muted} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between p-4">
                            <Text className="text-white font-medium">Privacy Policy</Text>
                            <Ionicons name="open-outline" size={20} color={COLORS.text.muted} />
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Sign Out"
                        onPress={signOut}
                        variant="outline"
                        className="mt-4"
                        icon={<Ionicons name="log-out-outline" size={20} color={COLORS.pink.hot} />}
                    />

                    <Text className="text-center text-text-muted text-xs mt-6">
                        Version 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
