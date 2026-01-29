import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        // Email/Password authentication
        Password,

        // OAuth providers (optional)
        // Google({
        //   clientId: process.env.GOOGLE_CLIENT_ID,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
        // Apple({
        //   clientId: process.env.APPLE_CLIENT_ID,
        //   clientSecret: process.env.APPLE_CLIENT_SECRET,
        // }),
    ],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx, args) {
            await ctx.runMutation(internal.users.createProfileOnSignUp, {
                userId: args.userId,
                email: "", // We'll let the user fill this or sync it later
            });
        },
    },
});
