/**
 * History Queries
 * 
 * React Query hooks for history data fetching.
 */
import { useQuery } from "@tanstack/react-query";
import { historyKeys } from "./keys";
import { getMyHistory } from "./api";

/**
 * Query hook for user's academic history
 */
export function useMyHistory() {
  return useQuery({
    queryKey: historyKeys.list(),
    queryFn: getMyHistory,
  });
}
