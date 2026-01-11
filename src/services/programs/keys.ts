/**
 * Programs Query Keys
 *
 * Centralized query keys for React Query cache management.
 */

export const programsKeys = {
  all: ["programs"] as const,
  lists: () => [...programsKeys.all, "list"] as const,
  list: () => [...programsKeys.lists()] as const,
  details: () => [...programsKeys.all, "detail"] as const,
  detail: (code: string) => [...programsKeys.details(), code] as const,
  activeVersion: (code: string) =>
    [...programsKeys.all, "active-version", code] as const,
  structure: (versionId: number) =>
    [...programsKeys.all, "structure", versionId] as const,
};
