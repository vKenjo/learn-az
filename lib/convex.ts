import { ConvexProviderWithAuth } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export { convex, ConvexProviderWithAuth };
