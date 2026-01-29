import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddQuestionScreen() {
    const router = useRouter();
    const createQuestion = useMutation(api.questions.createQuestion);

    const [domain, setDomain] = useState('AZ-900');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questionType, setQuestionType] = useState('single-choice'); // Added missing state
    const [content, setContent] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [explanation, setExplanation] = useState('');

    const handleSubmit = async () => {
        if (!content || !option1 || !option2 || !correctAnswer || !explanation) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            await createQuestion({
                domain,
                subdomain: 'General',
                difficulty,
                type: 'SingleChoice',
                content,
                options: [option1, option2, option3, option4].filter(o => o.trim() !== ''),
                correctAnswer,
                explanation,
            });
            Alert.alert('Success', 'Question added!');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add question');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-4 py-4 border-b border-white/10 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Add Question</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4 space-y-4">
                <View className="flex-row space-x-4 mb-2">
                    <TouchableOpacity
                        onPress={() => setQuestionType('single-choice')}
                        className={`flex-1 p-3 rounded-lg border ${questionType === 'single-choice' ? 'bg-pink-hot border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                    >
                        <Text className={`text-center font-bold ${questionType === 'single-choice' ? 'text-white' : 'text-text-secondary'}`}>Single Choice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setQuestionType('drag-drop')}
                        className={`flex-1 p-3 rounded-lg border ${questionType === 'drag-drop' ? 'bg-pink-hot border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                    >
                        <Text className={`text-center font-bold ${questionType === 'drag-drop' ? 'text-white' : 'text-text-secondary'}`}>Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setQuestionType('hotspot')}
                        className={`flex-1 p-3 rounded-lg border ${questionType === 'hotspot' ? 'bg-pink-hot border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                    >
                        <Text className={`text-center font-bold ${questionType === 'hotspot' ? 'text-white' : 'text-text-secondary'}`}>Hotspot</Text>
                    </TouchableOpacity>
                </View>

                {/* Domain & Difficulty Selection */}
                <View className="flex-row space-x-4 mb-2">
                    <Card className="flex-1 p-3">
                        <Text className="text-text-secondary text-xs mb-1">Domain</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['AZ-900', 'AZ-104', 'AZ-305'].map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    onPress={() => setDomain(d)}
                                    className={`px-2 py-1 rounded ${domain === d ? 'bg-pink-hot' : 'bg-white/10'}`}
                                >
                                    <Text className="text-white text-xs font-bold">{d}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                    <Card className="flex-1 p-3">
                        <Text className="text-text-secondary text-xs mb-1">Difficulty</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['Easy', 'Medium', 'Hard'].map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    onPress={() => setDifficulty(d)}
                                    className={`px-2 py-1 rounded ${difficulty === d ? 'bg-pink-hot' : 'bg-white/10'}`}
                                >
                                    <Text className="text-white text-xs font-bold">{d}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                </View>

                <Card>
                    <Text className="text-text-secondary mb-2">Question Text</Text>
                    <TextInput
                        className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10 h-24"
                        multiline
                        placeholder="Enter the question..."
                        placeholderTextColor={COLORS.text.muted}
                        value={content}
                        onChangeText={setContent}
                    />
                </Card>

                <Card>
                    {questionType === 'hotspot' ? (
                        <>
                            <Text className="text-text-secondary mb-2">Image URL</Text>
                            <TextInput
                                className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10 mb-4"
                                placeholder="https://example.com/diagram.png"
                                placeholderTextColor={COLORS.text.muted}
                                value={option1} // Reuse option1 for Image URL
                                onChangeText={setOption1}
                            />

                            <Text className="text-text-secondary mb-2">Target X (%)</Text>
                            <TextInput
                                className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10 mb-4"
                                placeholder="50"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.muted}
                                value={option2} // Reuse option2 for X
                                onChangeText={setOption2}
                            />

                            <Text className="text-text-secondary mb-2">Target Y (%)</Text>
                            <TextInput
                                className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10"
                                placeholder="50"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.text.muted}
                                value={option3} // Reuse option3 for Y
                                onChangeText={setOption3}
                            />
                        </>
                    ) : (
                        <>
                            <Text className="text-text-secondary mb-2">Options</Text>
                            {[setOption1, setOption2, setOption3, setOption4].map((setter, i) => (
                                <TextInput
                                    key={i}
                                    className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10 mb-2"
                                    placeholder={`Option ${i + 1}`}
                                    placeholderTextColor={COLORS.text.muted}
                                    onChangeText={setter}
                                />
                            ))}
                        </>
                    )}

                    <Text className="text-text-secondary mt-2 mb-2">
                        {questionType === 'drag-drop' ? 'Enter Options in CORRECT Order (Top to Bottom)' :
                            questionType === 'hotspot' ? 'Coordinates are target center (0-100)' :
                                'Correct Answer (Exact Match)'}
                    </Text>

                    {questionType === 'single-choice' && (
                        <TextInput
                            className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10"
                            placeholder="Copy exact correct option text"
                            placeholderTextColor={COLORS.text.muted}
                            value={correctAnswer}
                            onChangeText={setCorrectAnswer}
                        />
                    )}
                </Card>

                <Card>
                    <Text className="text-text-secondary mb-2">Explanation</Text>
                    <TextInput
                        className="text-white bg-bg-secondary p-3 rounded-lg border border-white/10 h-24"
                        multiline
                        placeholder="Why is it correct?"
                        placeholderTextColor={COLORS.text.muted}
                        value={explanation}
                        onChangeText={setExplanation}
                    />
                </Card>

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-pink-hot py-4 rounded-xl items-center mb-8"
                >
                    <Text className="text-white font-bold text-lg">Save Question</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
