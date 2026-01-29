import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { SingleChoice } from '@/components/questions/SingleChoice';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Timer component placeholder
function Timer({ duration, onExpire }: { duration: number, onExpire: () => void }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval);
                    onExpire();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <Text className="text-white font-mono font-bold">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Text>
    );
}

export default function TimedExam() {
    const { examId } = useLocalSearchParams();
    const router = useRouter();

    const [sessionId, setSessionId] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const startSession = useMutation(api.exams.startSession);

    useEffect(() => {
        if (examId && !sessionId) {
            startSession({
                examCode: examId as any,
                mode: 'timed',
                questionCount: 50,
                timeLimitMinutes: 60,
            }).then(setSessionId).catch(err => Alert.alert("Error", err.message));
        }
    }, [examId]);

    // Mock Data
    const currentQuestion = {
        _id: "mock-1",
        type: "single-choice",
        content: {
            question: "Which Azure service is best for serverless computing?",
            options: ["Azure VMs", "Azure Functions", "Azure Kubernetes Service", "Azure App Service"],
            correctIndex: 1,
        },
        explanation: "..."
    };

    const totalQuestions = 50;

    const handleSelectAnswer = (answer: any) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const handleFinish = () => {
        router.push("/(app)/results");
    };

    if (!sessionId) return <View className="flex-1 bg-bg-primary" />;

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-4 py-2 border-b border-white/5 flex-row justify-between items-center bg-bg-secondary">
                <Text className="text-text-secondary">Timed Exam</Text>
                <Timer duration={60 * 60} onExpire={handleFinish} />
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
