import clsx from 'clsx';
import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

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
    const baseStyles = "flex-row items-center justify-center rounded-xl active:opacity-80";

    const variants = {
        primary: "bg-gradient-to-r from-pink-hot to-purple-vivid border border-transparent",
        secondary: "bg-blue-DEFAULT",
        outline: "border border-blue-light bg-transparent",
        ghost: "bg-transparent",
    };

    // Note: We'll use style prop for gradients if nativewind doesn't support linear-gradient directly nicely without extra config
    // For now assuming we can style standard colors, and we might need a LinearGradient component for the actual gradient.
    // Given the constraints, let's stick to solid colors map to the theme closely or use a specific implementation later.
    // Re-mapping primary to a solid color for now to ensure it works, or use a complex background.

    const variantStyles = {
        primary: "bg-pink-hot", // Fallback if gradient not available
        secondary: "bg-bg-tertiary border border-white/10",
        outline: "border border-blue-DEFAULT",
        ghost: "bg-transparent",
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg font-semibold",
    };

    return (
        <Pressable
            ref={ref}
            className={clsx(
                baseStyles,
                variantStyles[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {title ? (
                        <Text className={clsx("text-white font-medium", textSizes[size], textClassName)}>
                            {title}
                        </Text>
                    ) : children}
                </>
            )}
        </Pressable>
    );
});
