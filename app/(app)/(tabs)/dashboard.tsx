import WeeklyActivityChart from '@/components/charts/WeeklyActivityChart';
import WeakAreasList from '@/components/stats/WeakAreasList';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
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

const examCards = [
    { code: 'AZ-900', name: 'Azure Fundamentals', level: 'Foundational', color: '#f72585', gradient: ['#f72585', '#b5179e'] as const },
    { code: 'AZ-104', name: 'Azure Administrator', level: 'Associate', color: '#7209b7', gradient: ['#7209b7', '#3a0ca3'] as const },
    { code: 'AZ-305', name: 'Solutions Architect', level: 'Expert', color: '#3f37c9', gradient: ['#3f37c9', '#4cc9f0'] as const },
];

const quickActions = [
    { mode: 'learn', label: 'Learn', subtitle: 'Study with feedback', icon: 'book' as const, color: '#f72585', gradient: ['#f72585', '#b5179e'] as const },
    { mode: 'timed', label: 'Timed', subtitle: 'Real exam pressure', icon: 'time' as const, color: '#4cc9f0', gradient: ['#4895ef', '#4cc9f0'] as const },
    { mode: 'mock', label: 'Mock', subtitle: 'Full simulation', icon: 'ribbon' as const, color: '#7209b7', gradient: ['#7209b7', '#560bad'] as const },
];

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const weeklyActivity = useQuery(api.progress.getWeeklyActivity);
    const weakAreas = useQuery(api.progress.getWeakAreas);
    const updateStreak = useMutation(api.users.updateStreak);

    useEffect(() => {
        if (user) {
            updateStreak();
        }
    }, [user, updateStreak]);

    const dailyDone = 0;
    const dailyGoal = user?.profile?.dailyGoal || 20;
    const dailyPercent = Math.round((dailyDone / dailyGoal) * 100);

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView className="flex-1 px-5 pt-4 pb-8" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-text-muted text-sm uppercase tracking-widest mb-1">Welcome back</Text>
                        <Text className="text-white text-2xl font-bold">{user?.profile?.name || user?.name || 'Learner'}</Text>
                    </View>
                    <View className="flex-row items-center overflow-hidden rounded-full bg-white/5 border border-white/10">
                        <View className="flex-row items-center px-4 py-2">
                            <Ionicons name="flame" size={18} color={COLORS.pink.hot} />
                            <Text className="text-white font-bold ml-1.5 text-base">{user?.profile?.currentStreak || 0}</Text>
                        </View>
                    </View>
                </View>

                {/* Daily Goal Card */}
                <View className="mb-6 rounded-2xl overflow-hidden border border-white/5 bg-bg-secondary p-5">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">Daily Goal</Text>
                            <Text className="text-white text-3xl font-bold mb-1">{dailyDone} / {dailyGoal}</Text>
                            <Text className="text-text-secondary text-sm">Questions today</Text>
                            {/* Progress bar */}
                            <View className="h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                                <View
                                    className="bg-pink-hot h-full rounded-full"
                                    style={{ width: `${Math.max(dailyPercent, 2)}%` }}
                                />
                            </View>
                        </View>
                        <View className="ml-4">
                            <ProgressRing
                                progress={dailyPercent}
                                radius={36}
                                stroke={6}
                                label={`${dailyPercent}%`}
                                color={COLORS.pink.hot}
                            />
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text className="text-white text-lg font-bold mb-3">Quick Start</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" contentContainerStyle={{ gap: 12 }}>
                    {quickActions.map((action) => (
                        <TouchableOpacity
                            key={action.mode}
                            activeOpacity={0.8}
                            onPress={() => router.push({ pathname: `/(app)/exam/[examId]/${action.mode}` as any, params: { examId: 'AZ-900' } })}
                        >
                            <View className="w-36 rounded-2xl overflow-hidden border border-white/5 bg-white/5 p-6 items-center">
                                <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${action.color}20` }}>
                                    <Ionicons name={action.icon} size={24} color={action.color} />
                                </View>
                                <Text className="text-white font-bold text-base">{action.label}</Text>
                                <Text className="text-text-muted text-xs text-center mt-1">{action.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Exam Selection */}
                <Text className="text-white text-lg font-bold mb-3">Certifications</Text>
                <View className="gap-3 mb-8">
                    {examCards.map((exam) => (
                        <TouchableOpacity
                            key={exam.code}
                            activeOpacity={0.8}
                            onPress={() => router.push({ pathname: "/(app)/exam/[examId]/learn", params: { examId: exam.code } })}
                        >
                            <View className="rounded-2xl overflow-hidden border border-white/5 bg-bg-secondary flex-row items-center pr-4">
                                <View className="w-1 self-stretch" style={{ backgroundColor: exam.color }} />
                                <View className="p-4 flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white font-bold text-lg">{exam.code}</Text>
                                        <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${exam.color}15` }}>
                                            <Text className="text-xs font-semibold uppercase" style={{ color: exam.color }}>{exam.level}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-text-secondary text-sm">{exam.name}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.text.muted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Weekly Activity */}
                <Text className="text-white text-lg font-bold mb-3">Weekly Activity</Text>
                <Card className="mb-8">
                    {weeklyActivity === undefined ? (
                        <View className="flex-row justify-between items-end h-32 px-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <Skeleton key={i} width={30} height={`${20 + i * 10}%`} borderRadius={4} />
                            ))}
                        </View>
                    ) : (
                        <WeeklyActivityChart data={weeklyActivity || []} />
                    )}
                </Card>

                {/* Focus Areas */}
                <Text className="text-white text-lg font-bold mb-3">Focus Areas</Text>
                <View className="mb-8">
                    {weakAreas === undefined ? (
                        <View className="gap-3">
                            <Skeleton height={60} width="100%" borderRadius={12} />
                            <Skeleton height={60} width="100%" borderRadius={12} />
                        </View>
                    ) : (
                        <WeakAreasList data={weakAreas || []} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
