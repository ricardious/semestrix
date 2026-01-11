import { useQuery } from "@tanstack/react-query";
import { authKeys } from "./keys";
import { getCurrentUser } from "./api";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}
