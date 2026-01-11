/**
 * Programs Queries
 *
 * React Query hooks for programs data fetching.
 */
import { useQuery } from "@tanstack/react-query";
import { programsKeys } from "./keys";
import {
  getPrograms,
  getActiveCurriculumVersion,
  getCurriculumStructure,
} from "./api";

/**
 * Query hook for fetching all programs
 */
export function usePrograms() {
  return useQuery({
    queryKey: programsKeys.list(),
    queryFn: getPrograms,
    staleTime: Infinity, // Never stale - programs rarely change
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for persistence
  });
}

/**
 * Query hook for fetching active curriculum version
 */
export function useActiveCurriculumVersion(programCode: string) {
  return useQuery({
    queryKey: programsKeys.activeVersion(programCode),
    queryFn: () => getActiveCurriculumVersion(programCode),
    enabled: !!programCode,
    staleTime: Infinity, // Never stale
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Query hook for fetching curriculum structure
 * Data is persisted to localStorage via react-query-persist-client
 */
export function useCurriculumStructure(versionId: number) {
  return useQuery({
    queryKey: programsKeys.structure(versionId),
    queryFn: () => getCurriculumStructure(versionId),
    enabled: !!versionId,
    staleTime: Infinity, // Never stale - curriculum structure rarely changes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
