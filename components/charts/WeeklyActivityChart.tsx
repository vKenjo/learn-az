import { Text, View } from 'react-native';

interface WeeklyActivityChartProps {
    data: { day: string; count: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    if (!data || data.length === 0) {
        return <Text className="text-text-secondary text-center">No activity yet</Text>;
    }

    const maxCount = Math.max(...data.map(d => d.count), 5); // Minimum scale of 5

    return (
        <View className="flex-row justify-between items-end h-32 px-2">
            {data.map((item, index) => {
                const heightPercentage = (item.count / maxCount) * 100;
                return (
                    <View key={index} className="items-center w-8">
                        <View
                            className="w-full bg-pink-hot rounded-t-sm"
                            style={{ height: `${Math.max(heightPercentage, 5)}%`, opacity: item.count > 0 ? 1 : 0.2 }}
                        />
                        <Text className="text-text-secondary text-[10px] mt-1">{item.day}</Text>
                    </View>
                );
            })}
        </View>
    );
}
