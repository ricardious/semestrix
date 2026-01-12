/**
 * Profiles Queries
 *
 * React Query hooks for profile data fetching.
 */
import { useQuery } from "@tanstack/react-query";
import { profilesKeys } from "./keys";
import { getProfileStatus, getMyProfile } from "./api";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";

/**
 * Query hook for profile status (used for onboarding flow)
 * Only fetches when user is authenticated
 */
export function useProfileStatus() {
  const { user } = useNeonAuth();

  return useQuery({
    queryKey: profilesKeys.status(),
    queryFn: getProfileStatus,
    enabled: !!user, // Only fetch when user is authenticated
    retry: false, // Don't retry if user doesn't have profile yet
  });
}

/**
 * Query hook for complete profile data
 * Only fetches when user is authenticated
 */
export function useMyProfile() {
  return useQuery({
    queryKey: profilesKeys.me(),
    queryFn: () => getMyProfile(),
    retry: false,
  });
}
