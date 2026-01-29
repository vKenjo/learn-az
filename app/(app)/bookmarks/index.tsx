import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarksScreen() {
    const router = useRouter();
    const bookmarks = useQuery(api.bookmarks.getBookmarks);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-6 py-4 border-b border-white/5 flex-row items-center justify-between">
                <Text className="text-white text-2xl font-bold">Bookmarks</Text>
                <Button
                    title="Done"
                    variant="ghost"
                    onPress={() => router.back()}
                />
            </View>

            <ScrollView className="flex-1 px-6 py-4">
                {!bookmarks ? (
                    <ActivityIndicator color={COLORS.pink.hot} />
                ) : bookmarks.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="bookmark-outline" size={64} color={COLORS.text.muted} />
                        <Text className="text-text-secondary mt-4 text-center">
                            No bookmarks yet.{'\n'}Save difficult questions to review later!
                        </Text>
                    </View>
                ) : (
                    bookmarks.map((b: any) => (
                        <Card key={b._id} className="mb-4 p-4">
                            <TouchableOpacity
                                onPress={() => {
                                    // Navigate to a practice mode for this question?
                                    // For now, simple alert or handled later
                                }}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-pink-hot text-xs font-bold mb-1 uppercase">
                                            {b.question?.examCode} • {b.question?.difficulty}
                                        </Text>
                                        <Text className="text-white font-medium" numberOfLines={2}>
                                            {b.question?.content.question}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => toggleBookmark({ questionId: b.questionId })}
                                        className="p-2"
                                    >
                                        <Ionicons name="bookmark" size={24} color={COLORS.pink.hot} />
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-text-secondary text-xs mt-3">
                                    Saved on {new Date(b.createdAt).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </Card>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
