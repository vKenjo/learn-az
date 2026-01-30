import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface WeeklyActivityChartProps {
    data: { day: string; count: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    if (!data || data.length === 0) {
        return (
            <View className="h-32 items-center justify-center">
                <Text className="text-text-muted text-sm">No activity yet. Start studying!</Text>
            </View>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count), 5);

    return (
        <View className="flex-row justify-between items-end h-36 px-1">
            {data.map((item, index) => {
                const heightPercentage = (item.count / maxCount) * 100;
                const isToday = index === data.length - 1;
                const barHeight = Math.max(heightPercentage, 4);

                return (
                    <View key={index} className="items-center flex-1 mx-1">
                        {item.count > 0 && (
                            <Text className="text-text-muted text-[10px] mb-1 font-semibold">{item.count}</Text>
                        )}
                        <View
                            className={clsx(
                                "w-full rounded-lg",
                                isToday ? "bg-pink-hot" : "bg-blue-vivid"
                            )}
                            style={{
                                height: `${barHeight}%`,
                                opacity: item.count > 0 ? 1 : 0.15
                            }}
                        />
                        <Text className={`text-[10px] mt-2 font-medium ${isToday ? 'text-pink-hot' : 'text-text-muted'}`}>
                            {item.day}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}
