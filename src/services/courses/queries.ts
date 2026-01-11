import { useQuery } from "@tanstack/react-query";
import { searchCourses } from "./api";
import { coursesKeys } from "./keys";

export function useSearchCourses(q: string, enabled: boolean = true) {
  return useQuery({
    queryKey: coursesKeys.search(q),
    queryFn: () => searchCourses(q),
    enabled: enabled && q.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
