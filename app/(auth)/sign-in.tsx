import { SignInForm } from "@/components/auth/SignInForm";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    return (
        <View className="flex-1 bg-bg-primary">
            <StatusBar style="light" />

            {/* Background Decorations - Safe implementation without filters */}
            <View className="absolute top-[-50] right-[-50] w-72 h-72 bg-pink-hot/10 rounded-full" />
            <View className="absolute bottom-[-20] left-[-30] w-60 h-60 bg-purple-vivid/5 rounded-full" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 justify-center px-8">
                    <View className="items-center mb-14">
                        <View className="w-24 h-24 bg-white/5 rounded-4xl items-center justify-center mb-8 border border-white/10 shadow-2xl overflow-hidden">
                            <View className="absolute inset-0 bg-pink-hot/5" />
                            <Ionicons name="finger-print-outline" size={48} color={COLORS.pink.hot} />
                        </View>

                        <Text className="text-5xl font-bold text-white mb-4 text-center tracking-tighter">
                            Welcome{"\n"}Back
                        </Text>
                        <Text className="text-text-secondary text-lg text-center font-medium max-w-[85%] leading-7">
                            Master your Azure certifications with precision.
                        </Text>
                    </View>

                    <View className="bg-bg-secondary p-8 rounded-5xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <View className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />
                        <SignInForm />
                    </View>

                    <View className="mt-12">
                        <View className="flex-row justify-center items-center">
                            <Text className="text-text-muted text-base">{"Don't have an account? "}</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <TouchableOpacity hitSlop={20}>
                                    <Text className="text-pink-hot font-bold text-base">Get Started</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
