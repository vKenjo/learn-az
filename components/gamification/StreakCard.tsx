import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
}

export const StreakCard = ({ currentStreak, longestStreak }: StreakCardProps) => {
    return (
        <Card className="flex-row items-center justify-between p-4 mb-4 bg-orange-500/10 border-orange-500/30">
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center mr-3">
                    <Ionicons name="flame" size={24} color={COLORS.orange} />
                </View>
                <View>
                    <Text className="text-white font-bold text-lg">{currentStreak} Day Streak</Text>
                    <Text className="text-text-secondary text-xs">Best: {longestStreak} days</Text>
                </View>
            </View>
            {currentStreak > 0 && (
                <View className="bg-orange-500/20 px-2 py-1 rounded">
                    <Text className="text-orange-500 text-xs font-bold">ACTIVE</Text>
                </View>
            )}
        </Card>
    );
};
