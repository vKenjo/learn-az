import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { Button } from '@/components/ui/Button';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnMode() {
    const { examId } = useLocalSearchParams();
    const router = useRouter();

    // State
    const [sessionId, setSessionId] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [checkResult, setCheckResult] = useState<any>(null);

    // API
    const startSession = useMutation(api.exams.startSession);
    const submitAnswer = useMutation(api.exams.submitAnswer);

    // Helper to load session questions (in real app, we'd query questions by session)
    // But for now, we rely on the session creation to give us IDs, 
    // and we might need to fetch the question content one by one or batch.
    // The schema stores questionIds in examSessions.
    // Let's create a helper query to fetch the current question.

    // Temporarily, let's fetch ALL questions for the session or fetch one by one.
    // We'll assume we can fetch the current question by ID.
    // First, we need to get the session details to know the question IDs.
    const session = useQuery(api.exams.getSession, sessionId ? { sessionId } : "skip");
    // Oops, I didn't create `getSession` API yet. I should add it to `exams.ts`.
    // For now, I'll mock that logic or just fetch questions directly if I can.
    // Actually, I should fix `exams.ts` to include `getSession`.

    // PLAN B: Reuse `getQuestion` from `questions.ts` if I have the ID.
    // But I don't have the ID until I get the session.
    // The `startSession` returns `sessionId`.

    // Let's implement `startSession` call on mount.
    useEffect(() => {
        if (examId && !sessionId) {
            startSession({
                examCode: examId as any,
                mode: 'learn',
                questionCount: 10, // Default batch
            }).then(setSessionId).catch(err => Alert.alert("Error", err.message));
        }
    }, [examId]);

    // Query session to get question IDs
    // I need to add `getSession` to `exams.ts`. I will do that in a follow up step.
    // For now, I'll assume I have the IDs or just mock 1 question for UI dev.

    // MOCK DATA FOR UI DEV until backend is fully wired with data
    const mockQuestion = {
        _id: "mock-1",
        type: "single-choice",
        content: {
            question: "Which Azure service is best for serverless computing?",
            options: ["Azure VMs", "Azure Functions", "Azure Kubernetes Service", "Azure App Service"],
            correctIndex: 1,
        },
        explanation: "Azure Functions is the serverless compute service."
    };

    const currentQuestion = mockQuestion; // Replace with real data fetch
    const totalQuestions = 10; // query from session

    const handleSelectAnswer = (answer: any) => {
        if (checkResult) return; // Already checked
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleCheck = async () => {
        // Call submitAnswer API
        // For now mock it
        const isCorrect = answers[currentQuestionIndex] === currentQuestion.content.correctIndex;
        setCheckResult({
            isCorrect,
            explanation: currentQuestion.explanation
        });

        // In real app:
        // await submitAnswer({ ... })
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setCheckResult(null);
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
        setCheckResult(null);
    };

    if (!sessionId) {
        return (
            <View className="flex-1 justify-center items-center bg-bg-primary">
                <ActivityIndicator size="large" color="#f72585" />
                <Text className="text-white mt-4">Starting Session...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-4 py-2 border-b border-white/5 flex-row justify-between items-center">
                <Text className="text-text-secondary">Exam: {examId}</Text>
                <Button title="Exit" size="sm" variant="ghost" onPress={() => router.back()} />
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Progress Bar (simplified) */}
                <View className="h-1 bg-bg-tertiary mb-6 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-pink-hot"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </View>

                {currentQuestion.type === 'single-choice' && (
                    <SingleChoice
                        question={currentQuestion}
                        selectedOption={answers[currentQuestionIndex]}
                        onSelectOption={handleSelectAnswer}
                        showFeedback={!!checkResult}
                    />
                )}
                {/* Add cases for other types */}

                {!checkResult && (
                    <Button
                        title="Check Answer"
                        className="mt-8"
                        onPress={handleCheck}
                        disabled={answers[currentQuestionIndex] === undefined}
                    />
                )}
            </ScrollView>

            <QuestionNavigator
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onPrevious={handlePrev}
                onNext={handleNext}
                canPrevious={currentQuestionIndex > 0}
                canNext={currentQuestionIndex < totalQuestions - 1} // OR if we allow going to next without checking (depends on rules)
            />
        </SafeAreaView>
    );
}
