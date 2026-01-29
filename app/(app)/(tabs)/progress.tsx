import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Progress() {
    const [refreshing, setRefreshing] = useState(false);

    // Using simplified query for now, assuming args are optional or valid
    const stats = useQuery(api.progress.getDashboardStats, {});

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // In Convex, queries auto-update, but for UX feel we can simulate a delay
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    if (!stats) {
        return (
            <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
                <Text className="text-text-secondary">Loading stats...</Text>
            </SafeAreaView>
        );
    }

    const { todayProgress, overallProgress, streak } = stats;

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView
                className="flex-1 px-4 py-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.pink.hot} />
                }
            >
                <Text className="text-white text-3xl font-bold mb-6">Your Progress</Text>

                {/* Readiness Score */}
                <Card className="items-center py-6 mb-6">
                    <Text className="text-text-secondary font-medium mb-4">ESTIMATED READINESS</Text>
                    <ProgressRing
                        progress={overallProgress.estimatedReadiness}
                        radius={80}
                        stroke={12}
                        label={`${overallProgress.estimatedReadiness}%`}
                        subLabel="Ready"
                        color={overallProgress.estimatedReadiness > 70 ? COLORS.correct : COLORS.pink.hot}
                    />
                    <Text className="text-text-muted text-center mt-4 px-8">
                        Based on your accuracy and coverage of the specific exam domains.
                    </Text>
                </Card>

                {/* Stats Grid */}
                <View className="flex-row gap-4 mb-6">
                    <Card className="flex-1 items-center py-4">
                        <Ionicons name="flame" size={24} color={COLORS.pink.hot} style={{ marginBottom: 8 }} />
                        <Text className="text-white font-bold text-xl">{streak.current}</Text>
                        <Text className="text-text-secondary text-xs">Day Streak</Text>
                    </Card>
                    <Card className="flex-1 items-center py-4">
                        <Ionicons name="help-circle" size={24} color={COLORS.blue.light} style={{ marginBottom: 8 }} />
                        <Text className="text-white font-bold text-xl">{overallProgress.questionsAttempted}</Text>
                        <Text className="text-text-secondary text-xs">Questions</Text>
                    </Card>
                    <Card className="flex-1 items-center py-4">
                        <Ionicons name="trophy" size={24} color={COLORS.warning} style={{ marginBottom: 8 }} />
                        <Text className="text-white font-bold text-xl">{Math.round(overallProgress.correctRate * 100)}%</Text>
                        <Text className="text-text-secondary text-xs">Accuracy</Text>
                    </Card>
                </View>

                {/* Domain Breakdown (Placeholder for now) */}
                <Text className="text-white text-xl font-bold mb-4">Weakest Areas</Text>
                <Card className="p-4 mb-8">
                    <Text className="text-text-secondary text-center">
                        Keep practicing to see your personalized domain breakdown.
                    </Text>
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
}
