import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../ui/Button';

interface Props {
    currentIndex: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
    canNext: boolean;
    canPrevious: boolean;
    onFinish?: () => void;
    onToggleBookmark?: () => void;
    isBookmarked?: boolean;
}

export function QuestionNavigator({
    currentIndex,
    totalQuestions,
    onPrevious,
    onNext,
    canNext,
    canPrevious,
    onFinish,
    onToggleBookmark,
    isBookmarked
}: Props) {
    const isLast = currentIndex === totalQuestions - 1;

    return (
        <View className="flex-row justify-between items-center bg-bg-secondary p-4 border-t border-white/5">
            <TouchableOpacity
                onPress={onPrevious}
                disabled={!canPrevious}
                className={!canPrevious ? "opacity-30" : "opacity-100"}
            >
                <View className="flex-row items-center">
                    <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
                    <Text className="text-white ml-2 font-medium">Prev</Text>
                </View>
            </TouchableOpacity>

            <Text className="text-text-secondary">
                {currentIndex + 1} <Text className="text-text-muted">/ {totalQuestions}</Text>
            </Text>

            {onToggleBookmark && (
                <TouchableOpacity onPress={onToggleBookmark} className="mx-2">
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isBookmarked ? COLORS.pink.hot : COLORS.text.secondary}
                    />
                </TouchableOpacity>
            )}

            {isLast && onFinish ? (
                <Button
                    title="Finish"
                    size="sm"
                    onPress={onFinish}
                />
            ) : (
                <TouchableOpacity
                    onPress={onNext}
                    disabled={!canNext}
                    className={!canNext ? "opacity-30" : "opacity-100"}
                >
                    <View className="flex-row items-center">
                        <Text className="text-white mr-2 font-medium">Next</Text>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.text.primary} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}
