/**
 * Profiles API Service
 *
 * API functions for user profile and onboarding management.
 */
import { api } from "../apiClient";
import type {
  ProfileStatus,
  AcademicProfile,
  CreateIdentityRequest,
  ProfileResponse,
} from "../../lib/types/api";

/**
 * Get current user's profile status
 */
export async function getProfileStatus(): Promise<ProfileStatus> {
  return api.get<ProfileStatus>("/profiles/status");
}

/**
 * Get current user's complete profile
 */
export async function getMyProfile(): Promise<AcademicProfile> {
  // Directly return the profile if it matches the schema, or unwrap if wrapper in response
  // Backend returns ProfileResponse which IS the profile flat structure for now in Pydantic?
  // Let's check schemas.py: ProfileResponse is { profile_id, user_id, ... }
  // Backend router returns ProfileResponse.
  // So response is the profile object itself, NOT { profile: ... } wrapper.
  // Wait, let's double check.
  // router says `response_model=ProfileResponse`.
  // schemas.py ProfileResponse has fields directly.
  // BUT in api.ts until now we assumed `response.profile`.
  // If previously it was `{ profile: ... }` then backend changed or we were wrong.
  // Looking at `src/profiles/schemas.py`, ProfileResponse is a flat model.
  // So `response` IS the profile.
  return api.get<AcademicProfile>("/profiles/me");
}

/**
 * Create or update user identity (student ID + career)
 */
export async function createOrUpdateIdentity(
  data: CreateIdentityRequest
): Promise<AcademicProfile> {
  // Similarly, POST /me returns ProfileResponse (flat)
  return api.post<AcademicProfile>("/profiles/me", data);
}

/**
 * Mark history as done (onboarding step 1 -> 2)
 */
export async function markHistoryDone(): Promise<AcademicProfile> {
  // Assuming this also returns flat profile
  return api.post<AcademicProfile>("/profiles/mark-history-done");
}

/**
 * Complete onboarding (onboarding step 2 -> 3)
 */
export async function completeOnboarding(): Promise<AcademicProfile> {
  return api.post<AcademicProfile>("/profiles/complete");
}
