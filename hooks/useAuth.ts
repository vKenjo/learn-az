import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useAuth() {
    const { signIn, signOut } = useAuthActions();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const user = useQuery(
        api.users.currentUser,
        isAuthenticated ? {} : "skip",
    );

    const handleSignIn = async (email: string, password: string) => {
        await signIn("password", { email, password, flow: "signIn" });
    };

    const handleSignUp = async (email: string, password: string, name: string) => {
        await signIn("password", { email, password, name, flow: "signUp" });
    };

    const handleSignOut = async () => {
        await signOut();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
    };
}
