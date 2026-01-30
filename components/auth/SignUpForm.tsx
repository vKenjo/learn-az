import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        setError("");

        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name);
        } catch (e: any) {
            setError(e.message || "Failed to create account. Please try again.");
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
                    label="Full Name"
                    placeholder="What's your name?"
                    value={name}
                    onChangeText={setName}
                    autoComplete="name"
                    textContentType="name"
                />
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
                    placeholder="Min. 6 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="new-password"
                    textContentType="newPassword"
                />
            </View>

            <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                size="lg"
                className="mt-6"
            />

            <View className="flex-row items-center my-8">
                <View className="flex-1 h-[1px] bg-white/10" />
                <Text className="mx-4 text-text-muted text-xs uppercase tracking-widest font-bold">Or sign up with</Text>
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
