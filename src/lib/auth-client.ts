import { createAuthClient } from "better-auth/react";
import { adminClient, jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// Ensure the environment variable is safe for client-side evaluation
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
  /** 
   * The base URL of the auth server.
   * If undefined, Better Auth will automatically use the relative path of the current domain.
   */
  baseURL: baseURL,
  plugins: [
    adminClient(), 
    jwtClient(),
    inferAdditionalFields<typeof auth>()
  ],
});

// Export utility hook types for state management and page components
export type AuthClient = typeof authClient;