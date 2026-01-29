import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="space-y-4 w-full">
            <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
            />
            <Input
                label="Email"
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                className="mt-4"
            />
        </View>
    );
}
