import clsx from 'clsx';
import { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    className?: string;
    variant?: 'default' | 'glass';
}

export const Card = forwardRef<View, CardProps>(({ className, variant = 'default', children, ...props }, ref) => {
    return (
        <View
            ref={ref}
            className={clsx(
                "bg-bg-secondary rounded-2xl border border-white/5 p-4",
                variant === 'glass' && "bg-white/5 backdrop-blur-lg",
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
});
