import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { Doc } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';

interface HotspotQuestionProps {
    question: Doc<"questions">;
    userAnswer?: { x: number, y: number }; // Normalized 0-100
    onAnswer: (answer: { x: number, y: number }) => void;
    isReview?: boolean;
}

export const HotspotQuestion = ({ question, userAnswer, onAnswer, isReview = false }: HotspotQuestionProps) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [marker, setMarker] = useState<{ x: number, y: number } | null>(userAnswer || null);

    // Parse options for Image URL (Admin tool will save Image URL in options[0] for simplicity or content field)
    // For now, let's assume content has the question text, and options[0] is the Image URL.
    // robust fallback if imageUrl is separate in schema (it is not currently, standardizing on options[0] or a new field would be good)
    // The plan said "Input field for Image URL" in Admin.
    // Let's assume we store the Image URL in `options[0]` for Hotspot types as a convention for now.
    const imageUrl = question.options?.[0];

    const handlePress = (evt: any) => {
        if (isReview) return;
        if (imageSize.width === 0 || imageSize.height === 0) return;

        const { locationX, locationY } = evt.nativeEvent;

        // Calculate percentage (0-100)
        const x = (locationX / imageSize.width) * 100;
        const y = (locationY / imageSize.height) * 100;

        const newMarker = { x, y };
        setMarker(newMarker);
        onAnswer(newMarker);
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setImageSize({ width, height });
    };

    if (!imageUrl) {
        return (
            <View className="items-center justify-center p-8 bg-bg-secondary rounded-xl">
                <Ionicons name="image-outline" size={48} color={COLORS.text.muted} />
                <Text className="text-text-muted mt-4">No image provided for this hotspot question.</Text>
            </View>
        );
    }

    return (
        <View>
            <Text className="text-white text-base mb-4 font-bold">
                Tap on the area that correctly answers the question.
            </Text>

            <Card className="p-0 overflow-hidden relative min-h-[300px]" style={{ aspectRatio: 4 / 3 }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handlePress}
                    className="w-full h-full"
                    onLayout={onLayout}
                >
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="contain" // Use contain to ensure full image is visible, OR cover if we want to fill
                    // Note: 'contain' might leave empty space which complicates coordinates if not careful.
                    // 'cover' is safer for full-bleed tapping if aspect ratio matches.
                    // For generic images, 'contain' inside a known box is safer for correctness, but we need to know the rendered image rect.
                    // Simplest for MVP: 'cover' and ask admin to upload approx 4:3 images.
                    />

                    {/* Marker */}
                    {marker && (
                        <View
                            className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white rounded-full bg-pink-hot/50 items-center justify-center shadow-lg"
                            style={{
                                left: `${marker.x}%`,
                                top: `${marker.y}%`
                            }}
                        >
                            <View className="w-2 h-2 bg-white rounded-full" />
                        </View>
                    )}

                    {/* Correct Answer Marker (Review Mode Only) */}
                    {isReview && question.correctAnswer && (
                        <View
                            className="absolute w-10 h-10 -ml-5 -mt-5 border-2 border-green-500 rounded-full bg-green-500/30 items-center justify-center"
                            // Assuming correctAnswer is stored as {x: number, y: number} or we parse it
                            style={{
                                left: `${(question.correctAnswer as any).x}%`,
                                top: `${(question.correctAnswer as any).y}%`
                            }}
                        >
                            <Ionicons name="checkmark" size={24} color="white" />
                        </View>
                    )}
                </TouchableOpacity>
            </Card>

            <Text className="text-text-muted text-xs text-center mt-2">
                Tap the image to place your marker.
            </Text>
        </View>
    );
};
