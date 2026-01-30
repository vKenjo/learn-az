import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, View } from 'react-native';

interface ButtonProps extends PressableProps {
    title?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export const Button = forwardRef<any, ButtonProps>(({
    title,
    variant = 'primary',
    size = 'md',
    loading,
    className,
    textClassName,
    icon,
    children,
    disabled,
    ...props
}, ref) => {
    const baseStyles = "flex-row items-center justify-center rounded-2xl overflow-hidden";

    const sizes = {
        sm: "h-10 px-4",
        md: "h-13 px-6",
        lg: "h-14 px-8",
    };

    const textSizes = {
        sm: "text-sm font-semibold",
        md: "text-base font-semibold",
        lg: "text-lg font-bold",
    };

    const variantStyles = {
        primary: "",
        secondary: "bg-bg-secondary border border-white/10",
        outline: "border border-pink-hot/60 bg-pink-hot/5",
        ghost: "bg-transparent",
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    {title ? (
                        <Text className={clsx(
                            "text-white tracking-wide",
                            textSizes[size],
                            variant === 'outline' && "text-pink-hot",
                            textClassName,
                        )}>
                            {title}
                        </Text>
                    ) : children}
                </>
            )}
        </>
    );

    if (variant === 'primary' && !disabled) {
        return (
            <Pressable
                ref={ref}
                className={clsx(baseStyles, sizes[size], className, "bg-pink-hot shadow-xl shadow-pink-hot/30")}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
                disabled={loading}
                {...props}
            >
                <View className="absolute top-0 left-0 right-0 h-1/2 bg-white/10" />
                {content}
            </Pressable>
        );
    }

    return (
        <Pressable
            ref={ref}
            className={clsx(
                baseStyles,
                variantStyles[variant],
                sizes[size],
                disabled && "opacity-40",
                className
            )}
            style={({ pressed }) => ({
                opacity: pressed ? 0.7 : disabled ? 0.4 : 1,
                transform: [{ scale: (pressed && !disabled) ? 0.98 : 1 }],
            })}
            disabled={disabled || loading}
            {...props}
        >
            {content}
        </Pressable>
    );
});

Button.displayName = 'Button';
