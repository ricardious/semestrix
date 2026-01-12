/**
 * History Query Keys
 * 
 * Centralized query keys for React Query cache management.
 */

export const historyKeys = {
  all: ["history"] as const,
  lists: () => [...historyKeys.all, "list"] as const,
  list: () => [...historyKeys.lists()] as const,
  details: () => [...historyKeys.all, "detail"] as const,
  detail: (id: number) => [...historyKeys.details(), id] as const,
};
