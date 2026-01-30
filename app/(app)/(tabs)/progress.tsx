import WeakAreasList from '@/components/stats/WeakAreasList';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Progress() {
    const [refreshing, setRefreshing] = useState(false);
    const stats = useQuery(api.progress.getDashboardStats, {});
    const weakAreas = useQuery(api.progress.getWeakAreas);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    if (!stats) {
        return (
            <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.pink.hot} />
                <Text className="text-text-muted mt-4 text-sm">Loading your stats...</Text>
            </SafeAreaView>
        );
    }

    const { todayProgress, overallProgress, streak } = stats;

    const statCards = [
        { icon: 'flame' as const, value: streak.current, label: 'Day Streak', color: '#f72585' },
        { icon: 'checkmark-circle' as const, value: overallProgress.questionsAttempted, label: 'Attempted', color: '#4361ee' },
        { icon: 'trophy' as const, value: `${Math.round(overallProgress.correctRate * 100)}%`, label: 'Accuracy', color: '#4cc9f0' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView
                className="flex-1 px-5 pt-4 pb-8"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.pink.hot} />
                }
            >
                <Text className="text-white text-2xl font-bold mb-6">Your Progress</Text>

                {/* Readiness Score */}
                <View className="rounded-2xl overflow-hidden border border-white/5 mb-6 bg-bg-secondary p-7 items-center">
                    <Text className="text-text-muted text-xs uppercase tracking-widest mb-5">Estimated Readiness</Text>
                    <ProgressRing
                        progress={overallProgress.estimatedReadiness}
                        radius={72}
                        stroke={10}
                        label={`${overallProgress.estimatedReadiness}%`}
                        subLabel="Ready"
                        color={overallProgress.estimatedReadiness >= 70 ? COLORS.correct : COLORS.pink.hot}
                    />
                    <Text className="text-text-muted text-xs text-center mt-5 px-6 leading-4">
                        Based on your accuracy and coverage across exam domains.
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row gap-3 mb-6">
                    {statCards.map((stat) => (
                        <View key={stat.label} className="flex-1 rounded-2xl overflow-hidden border border-white/5 bg-white/5 p-4 items-center">
                            <View className="w-10 h-10 rounded-full items-center justify-center mb-2" style={{ backgroundColor: `${stat.color}18` }}>
                                <Ionicons name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text className="text-white font-bold text-lg">{stat.value}</Text>
                            <Text className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Weak Areas */}
                <Text className="text-white text-lg font-bold mb-3">Focus Areas</Text>
                <View className="mb-8">
                    {weakAreas === undefined ? (
                        <Card className="items-center py-6">
                            <ActivityIndicator color={COLORS.text.muted} />
                        </Card>
                    ) : (
                        <WeakAreasList data={weakAreas || []} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
