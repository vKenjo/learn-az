import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
    const { signOut } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-bg-primary p-6">
            <Text className="text-white text-2xl font-bold mb-8">Settings</Text>

            <Button
                title="Sign Out"
                onPress={signOut}
                variant="outline"
                className="mt-auto"
            />
        </SafeAreaView>
    );
}
