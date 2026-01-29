import { SignUpForm } from "@/components/auth/SignUpForm";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
    return (
        <SafeAreaView className="flex-1 bg-bg-primary px-6 justify-center">
            <StatusBar style="light" />
            <View className="items-center mb-8">
                <Text className="text-4xl font-display font-bold text-white mb-2">
                    Get Started
                </Text>
                <Text className="text-text-secondary text-base text-center">
                    Create an account to track your progress
                </Text>
            </View>

            <SignUpForm />

            <View className="flex-row justify-center mt-8">
                <Text className="text-text-secondary">Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                        <Text className="text-pink-hot font-bold">Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
