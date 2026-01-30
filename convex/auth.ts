import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Password],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx, args) {
            if (args.existingUserId) {
                // User already exists, skip profile creation
                return;
            }
            const profile = args.profile as { email?: string; name?: string } | undefined;
            await ctx.runMutation(internal.users.createProfileOnSignUp, {
                userId: args.userId,
                email: profile?.email,
                name: profile?.name,
            });
        },
    },
});
