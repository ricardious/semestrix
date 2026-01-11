/**
 * Profiles Query Keys
 * 
 * Centralized query keys for React Query cache management.
 */

export const profilesKeys = {
  all: ["profiles"] as const,
  status: () => [...profilesKeys.all, "status"] as const,
  me: () => [...profilesKeys.all, "me"] as const,
};
