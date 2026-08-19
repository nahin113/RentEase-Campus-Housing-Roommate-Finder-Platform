import { createAuthClient } from "better-auth/react";
import { adminClient, jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [
    adminClient(), 
    jwtClient(),
    inferAdditionalFields<typeof auth>()
  ],
});

// Export utility hook types for state management and page components
export type AuthClient = typeof authClient;