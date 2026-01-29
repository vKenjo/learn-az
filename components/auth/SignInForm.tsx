import { useAuth } from "@/hooks/useAuth";

import { useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSignIn = async () => {

        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            // Auth state change will trigger redirect in _layout or index, 
            // but sometimes we might want to manually push if component stays mounted.
            // For now rely on reactive auth state.
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="space-y-4 w-full">
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
                title="Sign In"
                onPress={handleSignIn}
                loading={loading}
                className="mt-4"
            />
        </View>
    );
}
