import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
    question: any;
    selectedOptions: number[];
    onToggleOption: (index: number) => void;
    showFeedback?: boolean;
}

export function MultipleChoice({ question, selectedOptions, onToggleOption, showFeedback }: Props) {
    const content = question.content;
    // correctIndices expected in content for multiple choice 
    // (Note: Schema said correctIndices, check implementation)
    const correctIndices = content.correctIndices || [];

    return (
        <View className="space-y-4">
            <Text className="text-white text-lg font-medium leading-relaxed">
                {content.question}
            </Text>
            <Text className="text-text-muted text-sm uppercase font-bold tracking-wider">
                Select all that apply
            </Text>

            <View className="space-y-3 mt-4">
                {content.options.map((option: string, index: number) => {
                    const isSelected = selectedOptions.includes(index);
                    const isCorrectOption = correctIndices.includes(index);

                    let borderColor = 'border-white/10';
                    let bgColor = 'bg-bg-tertiary';

                    if (showFeedback && isCorrectOption) {
                        borderColor = 'border-cyan';
                        bgColor = 'bg-cyan/10';
                    } else if (showFeedback && isSelected && !isCorrectOption) {
                        borderColor = 'border-pink-hot';
                        bgColor = 'bg-pink-hot/10';
                    } else if (isSelected) {
                        borderColor = 'border-blue-DEFAULT';
                        bgColor = 'bg-blue-DEFAULT/10';
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => !showFeedback && onToggleOption(index)}
                            disabled={showFeedback}
                        >
                            <Card
                                className={clsx(
                                    "border p-4 flex-row items-center",
                                    borderColor,
                                    bgColor
                                )}
                            >
                                <View className={clsx(
                                    "w-6 h-6 rounded border-2 mr-3 items-center justify-center",
                                    isSelected ? "border-current bg-current" : "border-text-muted"
                                )}>
                                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                                </View>
                                <Text className="text-white flex-1">{option}</Text>

                                {showFeedback && isCorrectOption && (
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.cyan} />
                                )}
                                {showFeedback && isSelected && !isCorrectOption && (
                                    <Ionicons name="close-circle" size={24} color={COLORS.pink.hot} />
                                )}
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {showFeedback && (
                <View className="mt-6 p-4 bg-bg-secondary rounded-xl border-l-4 border-l-blue-DEFAULT">
                    <Text className="text-blue-light font-bold mb-2">Explanation</Text>
                    <Text className="text-text-secondary leading-relaxed">{question.explanation}</Text>
                </View>
            )}
        </View>
    );
}
