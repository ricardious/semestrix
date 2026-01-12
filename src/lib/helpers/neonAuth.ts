/**
 * Neon Auth Client Configuration
 *
 * Creates a Neon client with BetterAuth React adapter for authentication.
 * Note: We only use the auth part - dataApi is required but not used.
 */
import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

if (!import.meta.env.VITE_NEON_AUTH_URL) {
  throw new Error("VITE_NEON_AUTH_URL is not defined in environment variables");
}

export const neonClient = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    // Required by the SDK but not used - we use our own FastAPI backend
    url:
      import.meta.env.VITE_NEON_DATA_API_URL ||
      "https://placeholder.neon.tech/rest/v1",
  },
});
