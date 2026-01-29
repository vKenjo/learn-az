import clsx from 'clsx';
import { forwardRef } from 'react';
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
    return (
        <View className={clsx("space-y-2", containerClassName)}>
            {label && (
                <Text className="text-text-secondary text-sm font-medium ml-1">
                    {label}
                </Text>
            )}
            <TextInput
                ref={ref}
                placeholderTextColor="#666"
                className={clsx(
                    "bg-bg-tertiary text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-DEFAULT",
                    error && "border-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <Text className="text-red-500 text-xs ml-1">{error}</Text>
            )}
        </View>
    );
});
