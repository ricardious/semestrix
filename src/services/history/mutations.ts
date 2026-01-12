/**
 * History Mutations
 *
 * React Query mutation hooks for history updates.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { historyKeys } from "./keys";
import { profilesKeys } from "../profiles/keys";
import {
  previewHistoryImport,
  commitHistoryImport,
  createManualHistoryEntry,
  updateManualHistoryEntry,
  deleteManualHistoryEntry,
  bulkUpsertHistory,
} from "./api";
import type {
  ImportPreviewRequest,
  ImportCommitRequest,
  ManualCreateRequest,
  ManualUpdateRequest,
  HistoryBulkRequest,
} from "../../lib/types/api";

/**
 * Mutation for previewing history import
 */
export function usePreviewHistoryImport() {
  return useMutation({
    mutationFn: (data: ImportPreviewRequest) => previewHistoryImport(data),
  });
}

/**
 * Mutation for committing history import
 */
export function useCommitHistoryImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportCommitRequest) => commitHistoryImport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
      queryClient.invalidateQueries({ queryKey: profilesKeys.status() });
    },
  });
}

/**
 * Mutation for creating manual history entry
 */
export function useCreateManualHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManualCreateRequest) => createManualHistoryEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
    },
  });
}

/**
 * Mutation for updating manual history entry
 */
export function useUpdateManualHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      historyId,
      data,
    }: {
      historyId: number;
      data: ManualUpdateRequest;
    }) => updateManualHistoryEntry(historyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
    },
  });
}

/**
 * Mutation for deleting manual history entry
 */
export function useDeleteManualHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) => deleteManualHistoryEntry(historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
    },
  });
}

/**
 * Mutation for bulk upserting history
 */
export function useBulkUpsertHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HistoryBulkRequest) => bulkUpsertHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.list() });
      queryClient.invalidateQueries({ queryKey: profilesKeys.status() });
    },
  });
}
