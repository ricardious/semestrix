/**
 * Profiles Mutations
 * 
 * React Query mutation hooks for profile updates.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profilesKeys } from "./keys";
import {
  createOrUpdateIdentity,
  markHistoryDone,
  completeOnboarding,
} from "./api";
import type { CreateIdentityRequest } from "../../lib/types/api";

/**
 * Mutation for creating/updating identity (onboarding step 0 -> 1)
 */
export function useCreateIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIdentityRequest) => createOrUpdateIdentity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profilesKeys.status() });
      queryClient.invalidateQueries({ queryKey: profilesKeys.me() });
    },
  });
}

/**
 * Mutation for marking history as done (onboarding step 1 -> 2)
 */
export function useMarkHistoryDone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markHistoryDone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profilesKeys.status() });
      queryClient.invalidateQueries({ queryKey: profilesKeys.me() });
    },
  });
}

/**
 * Mutation for completing onboarding (onboarding step 2 -> 3)
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profilesKeys.status() });
      queryClient.invalidateQueries({ queryKey: profilesKeys.me() });
    },
  });
}
