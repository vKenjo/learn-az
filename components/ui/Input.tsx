import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    className,
    containerClassName,
    ...props
}, ref) => {
    const [focused, setFocused] = useState(false);

    return (
        <View className={clsx("mb-4", containerClassName)}>
            <View className={clsx(
                "rounded-2xl border transition-all duration-200 overflow-hidden",
                focused
                    ? "bg-bg-tertiary border-pink-hot/50 shadow-lg shadow-pink-hot/10"
                    : "bg-white/5 border-white/5"
            )}>
                {label && (
                    <Text className={clsx(
                        "text-[10px] uppercase tracking-widest font-bold mt-2.5 ml-4",
                        focused ? "text-pink-hot" : "text-text-muted",
                    )}>
                        {label}
                    </Text>
                )}
                <TextInput
                    ref={ref}
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    className={clsx(
                        "text-white text-base px-4 pb-3.5 pt-1",
                        className
                    )}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-pink-hot text-xs ml-1 mt-1.5 font-medium">{error}</Text>
            )}
        </View>
    );
});

Input.displayName = 'Input';
