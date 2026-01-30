import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (e: any) {
            setError(e.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="w-full">
            {error ? (
                <View className="bg-pink-hot/10 border border-pink-hot/30 rounded-2xl px-4 py-4 mb-6">
                    <Text className="text-pink-hot text-sm text-center font-medium">{error}</Text>
                </View>
            ) : null}

            <View>
                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                />
                <Input
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                />
            </View>

            <TouchableOpacity className="self-end mt-2 mb-6">
                <Text className="text-pink-hot/80 text-sm font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <Button
                title="Sign In"
                onPress={handleSignIn}
                loading={loading}
                size="lg"
            />

            <View className="flex-row items-center my-8">
                <View className="flex-1 h-[1px] bg-white/10" />
                <Text className="mx-4 text-text-muted text-xs uppercase tracking-widest font-bold">Or continue with</Text>
                <View className="flex-1 h-[1px] bg-white/10" />
            </View>

            <View className="flex-row gap-4">
                <TouchableOpacity className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center">
                    <Ionicons name="logo-apple" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center">
                    <Ionicons name="logo-google" size={22} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
