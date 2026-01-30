import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
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

export default function TimedExamMode() {
    const { examId } = useLocalSearchParams();
    const router = useRouter();

    // Setup State
    const [isSetup, setIsSetup] = useState(true);
    const [selectedCount, setSelectedCount] = useState(10);
    const [selectedTime, setSelectedTime] = useState(15); // Minutes

    // Session State
    const [sessionId, setSessionId] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API
    const startSession = useMutation(api.exams.startSession);
    const submitAnswer = useMutation(api.exams.submitAnswer);
    const completeSession = useMutation(api.exams.completeSession);

    const currentQuestion = MOCK_QUESTION;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (answer: any) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
        // Skip submission for mock questions (mock IDs aren't valid Convex IDs)
        if (sessionId && !currentQuestion._id.startsWith("mock")) {
            submitAnswer({
                sessionId,
                questionId: currentQuestion._id as any,
                userAnswer: answer,
                timeSpentSeconds: 0,
            });
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < selectedCount - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const performSubmit = useCallback(async () => {
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
    }, [sessionId, completeSession, router]);

    const handleFinish = useCallback(async () => {
        if (isSubmitting) return;

        // Confirm if not auto-submit (time > 0)
        if (timeLeft > 0) {
            Alert.alert(
                "Submit Exam",
                "Are you sure you want to finish?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Submit",
                        style: "destructive",
                        onPress: performSubmit
                    }
                ]
            );
        } else {
            performSubmit();
        }
    }, [isSubmitting, timeLeft, performSubmit]);

    // Timer
    useEffect(() => {
        if (!sessionId || isSetup) return;

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
    }, [sessionId, isSetup, handleFinish]);

    const handleStart = () => {
        setIsSetup(false);
        setTimeLeft(selectedTime * 60);

        startSession({
            examCode: examId as any,
            mode: 'timed',
            questionCount: selectedCount,
            timeLimitMinutes: selectedTime,
        }).then((id) => {
            setSessionId(id);
        }).catch(err => {
            Alert.alert("Error", err.message);
            setIsSetup(true); // Go back to setup on error
        });
    };

    // SETUP SCREEN
    if (isSetup) {
        return (
            <SafeAreaView className="flex-1 bg-bg-primary">
                <View className="px-6 py-4 border-b border-white/5 flex-row items-center">
                    <Button
                        title="Back"
                        variant="ghost"
                        icon={<Ionicons name="arrow-back" size={24} color="white" />}
                        onPress={() => router.back()}
                    />
                    <Text className="text-white text-xl font-bold ml-2">Configure Timed Exam</Text>
                </View>

                <View className="p-6">
                    <Text className="text-text-secondary mb-4 uppercase text-xs font-bold tracking-wider">Number of Questions</Text>
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {[5, 10, 20, 30, 50].map(count => (
                            <TouchableOpacity
                                key={count}
                                onPress={() => setSelectedCount(count)}
                                className={`px-6 py-3 rounded-xl border ${selectedCount === count ? 'bg-pink-hot border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                            >
                                <Text className={`font-bold ${selectedCount === count ? 'text-white' : 'text-text-secondary'}`}>
                                    {count}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-text-secondary mb-4 uppercase text-xs font-bold tracking-wider">Time Limit (Minutes)</Text>
                    <View className="flex-row flex-wrap gap-3 mb-10">
                        {[5, 10, 15, 30, 45, 60].map(mins => (
                            <TouchableOpacity
                                key={mins}
                                onPress={() => setSelectedTime(mins)}
                                className={`px-6 py-3 rounded-xl border ${selectedTime === mins ? 'bg-pink-hot border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                            >
                                <Text className={`font-bold ${selectedTime === mins ? 'text-white' : 'text-text-secondary'}`}>
                                    {mins}m
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="bg-bg-secondary p-4 rounded-xl mb-8 border border-white/5">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-text-secondary">Expected Duration:</Text>
                            <Text className="text-white font-bold">{selectedTime} Minutes</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-text-secondary">Pace:</Text>
                            <Text className="text-white font-bold">~{(selectedTime * 60 / selectedCount).toFixed(0)} sec / question</Text>
                        </View>
                    </View>

                    <Button title="Start Exam" onPress={handleStart} size="lg" />
                </View>
            </SafeAreaView>
        );
    }

    if (!sessionId) {
        return (
            <View className="flex-1 justify-center items-center bg-bg-primary">
                <ActivityIndicator size="large" color={COLORS.pink.hot} />
                <Text className="text-white mt-4">Starting Timer...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            {/* Header with Timer */}
            <View className="px-4 py-3 border-b border-white/5 flex-row justify-between items-center bg-bg-secondary">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color={timeLeft < 60 ? COLORS.incorrect : COLORS.text.primary} />
                    <Text className={`ml-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </Text>
                </View>
                <Button title="Finish" size="sm" variant="outline" onPress={handleFinish} />
            </View>

            {/* Question Area */}
            <View className="flex-1 px-4 py-6">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-text-secondary">Question {currentQuestionIndex + 1} of {selectedCount}</Text>
                    <Text className="text-text-muted text-xs uppercase">{currentQuestion.type}</Text>
                </View>

                <SingleChoice
                    question={currentQuestion}
                    selectedOption={answers[currentQuestionIndex]}
                    onSelectOption={handleSelectAnswer}
                    showFeedback={false}
                />
            </View>

            {/* Navigator */}
            <QuestionNavigator
                currentIndex={currentQuestionIndex}
                totalQuestions={selectedCount}
                onNext={handleNext}
                onPrevious={handlePrev}
                canNext={currentQuestionIndex < selectedCount - 1}
                canPrevious={currentQuestionIndex > 0}
                onFinish={handleFinish}
            />
        </SafeAreaView>
    );
}
