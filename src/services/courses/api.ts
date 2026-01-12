import { api } from "../apiClient";
import type { CoursesPageResponse } from "../../lib/types/api";

export async function searchCourses(
  q: string,
  limit: number = 20
): Promise<CoursesPageResponse> {
  // If query is too short, return empty result to avoid 400 from backend
  if (!q || q.length < 2) {
    return { items: [], total: 0, limit, offset: 0 };
  }

  const params = new URLSearchParams({ q, limit: String(limit) });
  return await api.get<CoursesPageResponse>(
    `/courses/search?${params.toString()}`
  );
}
