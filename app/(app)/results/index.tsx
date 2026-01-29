import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Results() {
    const router = useRouter();
    // In a real flow, we'd pass the sessionId and fetch the specific result
    // For demo, we'll just show a generic "Good Job" or mock data
    const { score, passed } = useLocalSearchParams();

    // Mock data if params missing
    const resultScore = score ? Number(score) : 750;
    const isPass = resultScore >= 700;

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView className="flex-1 px-6 py-8">
                <View className="items-center mb-8">
                    <Text className="text-white text-3xl font-bold mb-2">Exam Results</Text>
                    <Text className="text-text-secondary">AZ-900: Microsoft Azure Fundamentals</Text>
                </View>

                <View className="items-center mb-10">
                    <ProgressRing
                        progress={(resultScore / 1000) * 100}
                        radius={100}
                        stroke={16}
                        label={`${resultScore}`}
                        subLabel="/ 1000"
                        color={isPass ? COLORS.correct : COLORS.pink.hot}
                    />

                    <View className={`mt-6 px-6 py-2 rounded-full ${isPass ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <Text className={`font-bold text-lg ${isPass ? 'text-green-400' : 'text-pink-hot'}`}>
                            {isPass ? 'PASSED' : 'FAILED'}
                        </Text>
                    </View>
                </View>

                <Card className="mb-6">
                    <Text className="text-white font-bold text-lg mb-4">Session Summary</Text>
                    <View className="space-y-4">
                        <View className="flex-row justify-between">
                            <Text className="text-text-secondary">Correct Answers</Text>
                            <Text className="text-white font-bold">35 / 50</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-text-secondary">Time Taken</Text>
                            <Text className="text-white font-bold">45m 12s</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-text-secondary">Accuracy</Text>
                            <Text className="text-white font-bold">70%</Text>
                        </View>
                    </View>
                </Card>

                <View className="gap-4 mb-8">
                    <Button
                        title="Review Questions"
                        variant="secondary"
                        icon={<Ionicons name="list" size={20} color="white" />}
                        onPress={() => router.push({
                            pathname: "/(app)/exam/[examId]/review",
                            params: { examId: "AZ-900", sessionId: "mock-session-id" } // TODO: pass real session ID
                        })}
                    />
                    <Button
                        title="Back to Dashboard"
                        onPress={() => router.push("/(app)/(tabs)/dashboard")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
