import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { Button } from '@/components/ui/Button';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MockExam() {
    const { examId } = useLocalSearchParams();
    const router = useRouter();

    const [sessionId, setSessionId] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const startSession = useMutation(api.exams.startSession);
    const submitAnswer = useMutation(api.exams.submitAnswer);

    useEffect(() => {
        if (examId && !sessionId) {
            startSession({
                examCode: examId as any,
                mode: 'mock',
                questionCount: 40,
            }).then(setSessionId).catch(err => Alert.alert("Error", err.message));
        }
    }, [examId]);

    // Mock Data reuse (replace with fetch)
    const currentQuestion = {
        _id: "mock-1",
        type: "single-choice",
        content: {
            question: "Which Azure service is best for serverless computing?",
            options: ["Azure VMs", "Azure Functions", "Azure Kubernetes Service", "Azure App Service"],
            correctIndex: 1, // Hidden in mock mode usually until end
        },
        explanation: "..."
    };

    const totalQuestions = 40;

    const handleSelectAnswer = (answer: any) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleNext = () => {
        // Save answer
        submitAnswer({
            sessionId,
            questionId: currentQuestion._id as any,
            userAnswer: answers[currentQuestionIndex],
            timeSpentSeconds: 30, // Mock time
        });

        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const handleFinish = () => {
        // Submit final answer if needed
        // Then router.push result page
        router.push("/(app)/results");
    };

    if (!sessionId) return <View className="flex-1 bg-bg-primary" />;

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-4 py-2 border-b border-white/5 flex-row justify-between items-center">
                <Text className="text-text-secondary">Mock Exam: {examId}</Text>
                <Button title="Pause" size="sm" variant="ghost" />
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {currentQuestion.type === 'single-choice' && (
                    <SingleChoice
                        question={currentQuestion}
                        selectedOption={answers[currentQuestionIndex]}
                        onSelectOption={handleSelectAnswer}
                        showFeedback={false}
                    />
                )}
            </ScrollView>

            <QuestionNavigator
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onPrevious={handlePrev}
                onNext={handleNext}
                canPrevious={currentQuestionIndex > 0}
                canNext={currentQuestionIndex < totalQuestions - 1}
                onFinish={currentQuestionIndex === totalQuestions - 1 ? handleFinish : undefined}
            />
        </SafeAreaView>
    );
}
