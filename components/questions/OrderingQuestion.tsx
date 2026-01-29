import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { Doc } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OrderingQuestionProps {
    question: Doc<"questions">;
    userAnswer?: string[]; // Array of strings in user's order
    onAnswer: (answer: string[]) => void;
    isReview?: boolean;
}

export const OrderingQuestion = ({ question, userAnswer, onAnswer, isReview = false }: OrderingQuestionProps) => {
    // Local state for the selected order
    const [selectedOrder, setSelectedOrder] = useState<string[]>(userAnswer || []);

    // Remaining items are those in options but not in selectedOrder
    // We need to preserve the initial shuffled order of options
    const [availableItems, setAvailableItems] = useState<string[]>([]);

    useEffect(() => {
        const q = question as any;
        if (!q.options) return;

        if (userAnswer) {
            // In review mode or if answer exists, we just show what was selected
            // and what is remaining (if any, though usually all would be selected)
            const q = question as any;
            if (!q.options) return;

            // Filter out items already in the user's answer so they aren't duplicates
            // (Only relevant if we were dragging from a source list, but here we just have one list)
            // Actually, for re-ordering, we often start with all items.
            // Let's just use q.options directly if we haven't started.

            const remaining = q.options.filter((opt: any) => !userAnswer.includes(opt));
            setAvailableItems(remaining);
            setSelectedOrder(userAnswer);
        } else {
            // Initial state: all options available, none selected
            // Options from DB are already shuffled/randomized ideally, or we shuffle here
            // But for ordering questions, typically the DB provides them in a random order
            // distinct from the correct answer.
            const q = question as any;
            setAvailableItems([...q.options]);
            setSelectedOrder([]);
        }
    }, [question, userAnswer]);

    const handleSelect = (item: string) => {
        if (isReview) return;

        // Move from available to selected
        const newSelected = [...selectedOrder, item];
        const newAvailable = availableItems.filter(i => i !== item);

        setSelectedOrder(newSelected);
        setAvailableItems(newAvailable);
        onAnswer(newSelected);
    };

    const handleDeselect = (item: string) => {
        if (isReview) return;

        // Move from selected back to available
        const newSelected = selectedOrder.filter(i => i !== item);
        const newAvailable = [...availableItems, item];

        setSelectedOrder(newSelected);
        setAvailableItems(newAvailable);
        onAnswer(newSelected);
    };

    return (
        <View>
            <Text className="text-white text-base mb-4 font-bold">
                Tap items to place them in the correct order.
            </Text>

            {/* Selected Area (The "Drop Zone") */}
            <View className="mb-6">
                <Text className="text-pink-hot font-bold mb-2 uppercase text-xs">Your Order</Text>
                <View className="bg-bg-secondary rounded-xl p-2 min-h-[60px] space-y-2 border border-white/10 border-dashed">
                    {selectedOrder.length === 0 && (
                        <Text className="text-text-muted text-center py-4 italic">Tap items below to add them here</Text>
                    )}
                    {selectedOrder.map((item, index) => (
                        <TouchableOpacity
                            key={`${item}-${index}`}
                            onPress={() => handleDeselect(item)}
                            activeOpacity={0.8}
                        >
                            <Card className="flex-row items-center py-3 bg-bg-tertiary border-l-4 border-l-pink-hot">
                                <View className="bg-pink-hot/20 w-6 h-6 rounded-full items-center justify-center mr-3">
                                    <Text className="text-pink-hot font-bold text-xs">{index + 1}</Text>
                                </View>
                                <Text className="text-white flex-1">{item}</Text>
                                <Ionicons name="close-circle" size={20} color={COLORS.text.muted} />
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Available Items (The "Source") */}
            <View>
                <Text className="text-text-secondary font-bold mb-2 uppercase text-xs">Available Items</Text>
                <View className="space-y-2">
                    {availableItems.map((item, index) => (
                        <TouchableOpacity
                            key={`${item}-${index}`}
                            onPress={() => handleSelect(item)}
                            activeOpacity={0.8}
                        >
                            <Card className="py-3 bg-bg-secondary border border-white/5">
                                <Text className="text-text-secondary">{item}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};
