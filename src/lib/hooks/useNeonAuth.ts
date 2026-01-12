/**
 * Neon Auth Hook
 *
 * Custom hook to access Neon Auth state and methods using BetterAuthReactAdapter.
 */
import { neonClient } from "@lib/helpers/neonAuth";

export interface UseNeonAuthReturn {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  accessToken: string | null;
  getAccessToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

export function useNeonAuth(): UseNeonAuthReturn {
  const sessionQuery = neonClient.auth.useSession();

  const getAccessToken = async (): Promise<string | null> => {
    if (sessionQuery.data?.session?.token) {
      return sessionQuery.data.session.token;
    }
    return null;
  };

  const signOut = async (): Promise<void> => {
    await neonClient.auth.signOut();
  };

  return {
    user: sessionQuery.data?.user ?? null,
    session: sessionQuery.data ?? null,
    isLoading: sessionQuery.isPending,
    accessToken: sessionQuery.data?.session?.token ?? null,
    getAccessToken,
    signOut,
  };
}
