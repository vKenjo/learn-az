import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data fallback
const MOCK_QUESTION = {
    _id: "mock-1",
    type: "single-choice",
    content: {
        question: "Which Azure service is best for serverless computing?",
        options: ["Azure VMs", "Azure Functions", "Azure Kubernetes Service", "Azure App Service"],
        correctIndex: 1,
    },
    explanation: "Azure Functions is the serverless compute service."
};

export default function MockExamMode() {
    const { examId } = useLocalSearchParams();
    const router = useRouter();

    // State
    const [sessionId, setSessionId] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(60 * 60); // Default 60 mins
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API
    const startSession = useMutation(api.exams.startSession);
    const submitAnswer = useMutation(api.exams.submitAnswer);
    const completeSession = useMutation(api.exams.completeSession);

    // We'll mock the question data for now as before
    const currentQuestion = MOCK_QUESTION;
    const totalQuestions = 40; // Mock exam standard

    // Timer
    useEffect(() => {
        if (!sessionId) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish(); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionId]);

    // Start Session
    useEffect(() => {
        if (examId && !sessionId) {
            startSession({
                examCode: examId as any,
                mode: 'mock',
                questionCount: 40,
                timeLimitMinutes: 60,
            }).then((id) => {
                setSessionId(id);
            }).catch(err => Alert.alert("Error", err.message));
        }
    }, [examId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (answer: any) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));

        // In mock mode, we silently submit or just store local
        // For robustness, let's submit silently so progress is saved
        if (sessionId) {
            submitAnswer({
                sessionId,
                questionId: currentQuestion._id as any,
                userAnswer: answer,
                timeSpentSeconds: 0, // We could track per question but for now 0
            });
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const handleFinish = async () => {
        if (isSubmitting) return;

        Alert.alert(
            "Submit Exam",
            "Are you sure you want to finish?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Submit",
                    style: "destructive",
                    onPress: async () => {
                        setIsSubmitting(true);
                        try {
                            if (sessionId) {
                                await completeSession({ sessionId });
                                router.replace({
                                    pathname: "/(app)/results",
                                    params: { sessionId }
                                });
                            }
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                            setIsSubmitting(false);
                        }
                    }
                }
            ]
        );
    };

    if (!sessionId) {
        return (
            <View className="flex-1 justify-center items-center bg-bg-primary">
                <ActivityIndicator size="large" color={COLORS.pink.hot} />
                <Text className="text-white mt-4">Preparing your exam...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            {/* Header with Timer */}
            <View className="px-4 py-3 border-b border-white/5 flex-row justify-between items-center bg-bg-secondary">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color={timeLeft < 300 ? COLORS.incorrect : COLORS.text.primary} />
                    <Text className={`ml-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </Text>
                </View>
                <Button title="Finish Exam" size="sm" variant="outline" onPress={handleFinish} />
            </View>

            {/* Question Area */}
            <View className="flex-1 px-4 py-6">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-text-secondary">Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
                    <Text className="text-text-muted text-xs uppercase">{currentQuestion.type}</Text>
                </View>

                <SingleChoice
                    question={currentQuestion.content}
                    selectedOption={answers[currentQuestionIndex]}
                    onSelectOption={handleSelectAnswer}
                    showFeedback={false}
                />
            </View>

            {/* Navigator */}
            <QuestionNavigator
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onNext={handleNext}
                onPrevious={handlePrev}
                canNext={currentQuestionIndex < totalQuestions - 1}
                canPrevious={currentQuestionIndex > 0}
                onFinish={handleFinish} // Should trigger confirm
            />
        </SafeAreaView>
    );
}
