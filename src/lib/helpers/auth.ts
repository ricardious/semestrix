/**
 * Neon Auth Client Configuration (Official)
 *
 * Creates authentication client following Neon Auth documentation.
 * This is the official way to configure Neon Auth for the app.
 */
import { createAuthClient } from "@neondatabase/neon-js/auth";

if (!import.meta.env.VITE_NEON_AUTH_URL) {
  throw new Error("VITE_NEON_AUTH_URL is not defined in environment variables");
}

/**
 * Official Neon Auth client instance
 * Use this for all authentication operations
 */
export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
