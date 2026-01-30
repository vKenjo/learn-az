import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
    className?: string;
}

export const Skeleton = ({ width, height, borderRadius = 8, style, className = "" }: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, [opacity]);

    return (
        <Animated.View
            className={`bg-white/10 ${className}`}
            style={[
                {
                    width: width,
                    height: height,
                    borderRadius: borderRadius,
                    opacity: opacity
                },
                style
            ]}
        />
    );
};
