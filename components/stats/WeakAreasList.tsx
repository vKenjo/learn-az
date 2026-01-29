import { Card } from '@/components/ui/Card';
import { Text, View } from 'react-native';

interface WeakArea {
    domain: string;
    accuracy: number;
    total: number;
}

interface WeakAreasListProps {
    data: WeakArea[];
}

export default function WeakAreasList({ data }: WeakAreasListProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="items-center py-6">
                <Text className="text-text-secondary">Keep practicing to generate insights!</Text>
            </Card>
        );
    }

    return (
        <View className="space-y-3">
            {data.map((item, index) => (
                <Card key={index} className="flex-row justify-between items-center py-3 px-4 bg-bg-secondary border border-white/5">
                    <View className="flex-1 mr-4">
                        <Text className="text-white font-bold text-sm mb-1">{item.domain}</Text>
                        <Text className="text-text-secondary text-xs">{item.total} questions answered</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-pink-hot font-bold">{item.accuracy.toFixed(0)}%</Text>
                        <Text className="text-text-muted text-[10px]">Accuracy</Text>
                    </View>
                </Card>
            ))}
        </View>
    );
}
