import { useConvexAuth } from "convex/react";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-bg-primary">
                <ActivityIndicator size="large" color="#f72585" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
