import { SignUpForm } from "@/components/auth/SignUpForm";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
    return (
        <View className="flex-1 bg-bg-primary">
            <StatusBar style="light" />

            {/* Background Decorations */}
            <View className="absolute top-[-40] left-[-40] w-80 h-80 bg-blue-vivid/10 rounded-full" />
            <View className="absolute bottom-[-30] right-[-30] w-64 h-64 bg-cyan/5 rounded-full" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 justify-center px-8">
                    <View className="items-center mb-14">
                        <View className="w-24 h-24 bg-white/5 rounded-4xl items-center justify-center mb-8 border border-white/10 shadow-2xl overflow-hidden">
                            <View className="absolute inset-0 bg-blue-vivid/5" />
                            <Ionicons name="rocket-outline" size={48} color={COLORS.blue.vivid} />
                        </View>

                        <Text className="text-5xl font-bold text-white mb-4 text-center tracking-tighter">
                            Get{"\n"}Started
                        </Text>
                        <Text className="text-text-secondary text-lg text-center font-medium max-w-[85%] leading-7">
                            The smartest way to prepare for Azure exams.
                        </Text>
                    </View>

                    <View className="bg-bg-secondary p-8 rounded-5xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <View className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />
                        <SignUpForm />
                    </View>

                    <View className="mt-12">
                        <View className="flex-row justify-center items-center">
                            <Text className="text-text-muted text-base">Already a member? </Text>
                            <Link href="/(auth)/sign-in" asChild>
                                <TouchableOpacity hitSlop={20}>
                                    <Text className="text-blue-vivid font-bold text-base">Log In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
