import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewExam() {
    const { sessionId } = useLocalSearchParams();
    const router = useRouter();

    // Fetch session details (mock for now if API not ready)
    const session = useQuery(api.exams.getSession, { sessionId: sessionId as any });

    // We needs reactions/responses to know what was correct/incorrect
    // Implementation plan: create a new query `getReviewData` in convex/exams.ts? 
    // Or just fetch session and responses.

    // For UI dev, let's mock the data structure we expect
    const reviewData = {
        questions: [
            { id: '1', text: 'Which Azure service...', yourAnswer: 'A', correctAnswer: 'B', isCorrect: false },
            { id: '2', text: 'What is the SLA for...', yourAnswer: 'C', correctAnswer: 'C', isCorrect: true },
            // ... more items
        ]
    };

    if (!session && !reviewData) {
        return (
            <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
                <Text className="text-text-secondary">Loading review...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-4 py-2 border-b border-white/5 flex-row items-center">
                <Button
                    title="Back"
                    variant="ghost"
                    icon={<Ionicons name="arrow-back" size={20} color="white" />}
                    onPress={() => router.back()}
                />
                <Text className="text-white text-lg font-bold ml-2">Review Exam</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <Text className="text-text-secondary mb-4">
                    Review your answers below. Tapping a question will show the detailed explanation.
                </Text>

                {reviewData.questions.map((q, index) => (
                    <Card key={q.id} className="mb-4 p-4">
                        <View className="flex-row items-start">
                            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${q.isCorrect ? 'bg-green-500/20' : 'bg-pink-hot/20'}`}>
                                <Ionicons
                                    name={q.isCorrect ? "checkmark" : "close"}
                                    size={16}
                                    color={q.isCorrect ? COLORS.correct : COLORS.pink.hot}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-medium mb-1">Question {index + 1}</Text>
                                <Text className="text-text-secondary text-sm" numberOfLines={2}>{q.text}</Text>

                                {!q.isCorrect && (
                                    <Text className="text-pink-hot text-xs mt-2">
                                        Your answer: {q.yourAnswer} | Correct: {q.correctAnswer}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.text.muted} />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
