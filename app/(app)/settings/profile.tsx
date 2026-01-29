import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
    const router = useRouter();
    const user = useQuery(api.users.currentUser);
    const updateProfile = useMutation(api.users.upsertProfile);

    const [name, setName] = useState('');
    const [selectedExam, setSelectedExam] = useState<"AZ-900" | "AZ-104" | "AZ-305">("AZ-900");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.profile) {
            setName(user.profile.name || '');
            if (user.profile.selectedExam) {
                setSelectedExam(user.profile.selectedExam);
            }
        }
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Name cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                name: name.trim(),
                selectedExam: selectedExam
            });
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
                <ActivityIndicator color={COLORS.pink.hot} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="px-6 py-4 border-b border-white/5 flex-row items-center">
                <Button
                    title="Back"
                    variant="ghost"
                    icon={<Ionicons name="arrow-back" size={24} color="white" />}
                    onPress={() => router.back()}
                />
                <Text className="text-white text-xl font-bold ml-2">Edit Profile</Text>
            </View>

            <View className="p-6">
                <View className="mb-6">
                    <Text className="text-text-secondary mb-2">Display Name</Text>
                    <TextInput
                        className="bg-bg-secondary text-white p-4 rounded-xl border border-white/10"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor={COLORS.text.muted}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-text-secondary mb-2">Target Exam</Text>
                    <View className="flex-row gap-3">
                        {["AZ-900", "AZ-104", "AZ-305"].map((exam) => (
                            <TouchableOpacity
                                key={exam}
                                onPress={() => setSelectedExam(exam as any)}
                                className={`flex-1 p-3 rounded-xl border ${selectedExam === exam ? 'bg-pink-hot/20 border-pink-hot' : 'bg-bg-secondary border-white/10'}`}
                            >
                                <Text className={`text-center font-bold ${selectedExam === exam ? 'text-pink-hot' : 'text-text-secondary'}`}>
                                    {exam}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Button
                    title={isSaving ? "Saving..." : "Save Changes"}
                    onPress={handleSave}
                    disabled={isSaving}
                />
            </View>
        </SafeAreaView>
    );
}
