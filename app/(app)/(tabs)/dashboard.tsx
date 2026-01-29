import WeeklyActivityChart from '@/components/charts/WeeklyActivityChart';
import WeakAreasList from '@/components/stats/WeakAreasList';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const weeklyActivity = useQuery(api.progress.getWeeklyActivity);
    const weakAreas = useQuery(api.progress.getWeakAreas);

    // Fetch full user profile for streaks using the users API helper
    // We strictly need this to be defined for the streak card
    const userProfile = useQuery(api.users.currentUser);
    const updateStreak = useMutation(api.users.updateStreak);

    useEffect(() => {
        if (user) {
            updateStreak();
        }
    }, [user, updateStreak]);
    const examCards = [
        { code: 'AZ-900', name: 'Microsoft Azure Fundamentals', level: 'Foundational', color: COLORS.pink.hot },
        { code: 'AZ-104', name: 'Microsoft Azure Administrator', level: 'Associate', color: COLORS.purple.vivid },
        { code: 'AZ-305', name: 'Designing Azure Solutions', level: 'Expert', color: COLORS.blue.vivid },
    ];

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView className="flex-1 px-4 py-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-text-secondary text-base">Welcome back,</Text>
                        <Text className="text-white text-2xl font-bold">{user?.name || 'Learner'}</Text>
                    </View>
                    <View className="flex-row items-center bg-bg-secondary px-3 py-1 rounded-full border border-white/10">
                        <Ionicons name="flame" size={20} color={COLORS.pink.hot} />
                        <Text className="text-white font-bold ml-1">{user?.profile?.currentStreak || 0}</Text>
                    </View>
                </View>

                {/* Current Goal / Progress */}
                <Card className="mb-6 bg-gradient-to-r from-bg-secondary to-bg-tertiary">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-pink-hot font-bold mb-1">DAILY GOAL</Text>
                            <Text className="text-white text-3xl font-bold">0 / 20</Text>
                            <Text className="text-text-secondary text-sm">Questions today</Text>
                        </View>
                        {/* Simple Ring Placeholder */}
                        <View className="w-16 h-16 rounded-full border-4 border-white/10 items-center justify-center">
                            <Text className="text-white font-bold">0%</Text>
                        </View>
                    </View>
                </Card>

                {/* Exam Selection */}
                <Text className="text-white text-xl font-bold mb-4">Select Exam</Text>
                <View className="space-y-4 mb-8">
                    {examCards.map((exam) => (
                        <TouchableOpacity
                            key={exam.code}
                            onPress={() => router.push({ pathname: "/(app)/exam/[examId]/learn", params: { examId: exam.code } })}
                        >
                            <Card className="flex-row items-center p-0 overflow-hidden">
                                <View className="w-2 h-full" style={{ backgroundColor: exam.color }} />
                                <View className="p-4 flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white font-bold text-lg">{exam.code}</Text>
                                        <View className="bg-white/10 px-2 py-0.5 rounded text-xs">
                                            <Text className="text-text-secondary text-xs uppercase">{exam.level}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-text-secondary text-sm">{exam.name}</Text>
                                </View>
                                <View className="pr-4">
                                    <Ionicons name="chevron-forward" size={24} color={COLORS.text.muted} />
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Weekly Activity */}
                <View className="mb-8">
                    <Text className="text-white text-lg font-bold mb-4">Your Activity</Text>
                    <Card>
                        {weeklyActivity === undefined ? (
                            <View className="flex-row justify-between items-end h-32 px-2">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <Skeleton key={i} width={30} height={`${Math.random() * 50 + 20}%`} borderRadius={4} />
                                ))}
                            </View>
                        ) : (
                            <WeeklyActivityChart data={weeklyActivity || []} />
                        )}
                    </Card>
                </View>

                {/* Focus Areas */}
                <View className="mb-8">
                    <Text className="text-white text-lg font-bold mb-4">Focus Areas</Text>
                    {weakAreas === undefined ? (
                        <View className="space-y-3">
                            <Skeleton height={60} width="100%" borderRadius={12} />
                            <Skeleton height={60} width="100%" borderRadius={12} />
                            <Skeleton height={60} width="100%" borderRadius={12} />
                        </View>
                    ) : (
                        <WeakAreasList data={weakAreas || []} />
                    )}
                </View>

                {/* Quick Actions */}
                <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4 mb-8">
                    <TouchableOpacity onPress={() => router.push({ pathname: "/(app)/exam/AZ-900/learn" })}>
                        <Card className="w-40 items-center py-6">
                            <Ionicons name="book" size={32} color={COLORS.pink.hot} style={{ marginBottom: 12 }} />
                            <Text className="text-white font-bold">Learn Mode</Text>
                            <Text className="text-text-secondary text-xs text-center mt-1">Study specific topics</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push({ pathname: "/(app)/exam/AZ-900/timed" })}>
                        <Card className="w-40 items-center py-6">
                            <Ionicons name="time" size={32} color={COLORS.cyan} style={{ marginBottom: 12 }} />
                            <Text className="text-white font-bold">Timed Exam</Text>
                            <Text className="text-text-secondary text-xs text-center mt-1">Simulate real exam</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push({ pathname: "/(app)/exam/AZ-900/mock" })}>
                        <Card className="w-40 items-center py-6">
                            <Ionicons name="ribbon" size={32} color={COLORS.purple.vivid} style={{ marginBottom: 12 }} />
                            <Text className="text-white font-bold">Mock Exam</Text>
                            <Text className="text-text-secondary text-xs text-center mt-1">Full Certification</Text>
                        </Card>
                    </TouchableOpacity>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}
