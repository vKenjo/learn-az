import { SignInForm } from "@/components/auth/SignInForm";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    return (
        <SafeAreaView className="flex-1 bg-bg-primary px-6 justify-center">
            <StatusBar style="light" />
            <View className="items-center mb-8">
                <Text className="text-4xl font-display font-bold text-white mb-2">
                    Welcome Back
                </Text>
                <Text className="text-text-secondary text-base text-center">
                    Continue your journey to Azure mastery
                </Text>
            </View>

            <SignInForm />

            <View className="flex-row justify-center mt-8">
                <Text className="text-text-secondary">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                    <TouchableOpacity>
                        <Text className="text-pink-hot font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
