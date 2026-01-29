import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

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
});
