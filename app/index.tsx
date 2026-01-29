import { useConvexAuth } from "convex/react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-bg-primary">
                <ActivityIndicator size="large" color="#f72585" />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/(app)/(tabs)/dashboard" />;
        // Note: 'dashboard' is inside (tabs), so path should be /(app)/(tabs)/dashboard or just /(app) if tabs index is dashboard.
        // Let's assume (tabs)/index.tsx or (tabs)/dashboard.tsx. The plan says (tabs)/dashboard.tsx.
        // So the path is likely `/(app)/(tabs)/dashboard` unless I set up a redirect in (tabs)/_layout.tsx
    }

    return <Redirect href="/(auth)/sign-in" />;
}
