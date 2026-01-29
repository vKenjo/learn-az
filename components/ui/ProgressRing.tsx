import { COLORS } from '@/constants/theme';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
    radius?: number;
    stroke?: number;
    progress: number; // 0 to 100
    color?: string;
    bgColor?: string;
    label?: string;
    subLabel?: string;
}

export function ProgressRing({
    radius = 60,
    stroke = 10,
    progress,
    color = COLORS.pink.hot,
    bgColor = 'rgba(255, 255, 255, 0.1)',
    label,
    subLabel
}: Props) {
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View className="items-center justify-center">
            <View style={{ width: radius * 2, height: radius * 2 }}>
                <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                    <Circle
                        stroke={bgColor}
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <Circle
                        stroke={color}
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${radius}, ${radius}`}
                    />
                </Svg>
                <View className="absolute inset-0 items-center justify-center">
                    {label && (
                        <Text className="text-white font-bold text-2xl">{label}</Text>
                    )}
                    {subLabel && (
                        <Text className="text-text-secondary text-xs">{subLabel}</Text>
                    )}
                </View>
            </View>
        </View>
    );
}
