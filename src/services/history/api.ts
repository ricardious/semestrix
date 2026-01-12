/**
 * History API Service
 *
 * API functions for academic history management.
 */
import { api } from "../apiClient";
import type {
  HistoryListResponse,
  HistoryItem,
  ImportPreviewRequest,
  ImportPreviewResponse,
  ImportCommitRequest,
  ImportCommitResponse,
  ManualCreateRequest,
  ManualUpdateRequest,
  HistoryBulkRequest,
  HistoryBulkResult,
} from "../../lib/types/api";

/**
 * Get user's academic history
 */
export async function getMyHistory(): Promise<HistoryItem[]> {
  const response = await api.get<HistoryListResponse>("/history/me");
  return response.items;
}

/**
 * Preview history import
 */
export async function previewHistoryImport(
  data: ImportPreviewRequest
): Promise<ImportPreviewResponse> {
  return api.post<ImportPreviewResponse>("/history/import/preview", data);
}

/**
 * Commit history import
 */
export async function commitHistoryImport(
  data: ImportCommitRequest
): Promise<ImportCommitResponse> {
  return api.post<ImportCommitResponse>("/history/import/commit", data);
}

/**
 * Create manual history entry
 */
export async function createManualHistoryEntry(
  data: ManualCreateRequest
): Promise<HistoryItem> {
  return api.post<HistoryItem>("/history/manual", data);
}

/**
 * Update manual history entry
 */
export async function updateManualHistoryEntry(
  historyId: number,
  data: ManualUpdateRequest
): Promise<HistoryItem> {
  return api.patch<HistoryItem>(`/history/manual/${historyId}`, data);
}

/**
 * Delete manual history entry
 */
export async function deleteManualHistoryEntry(
  historyId: number
): Promise<void> {
  return api.delete(`/history/manual/${historyId}`);
}

/**
 * Bulk upsert history entries
 */
export async function bulkUpsertHistory(
  data: HistoryBulkRequest
): Promise<HistoryBulkResult> {
  return api.post<HistoryBulkResult>("/history/bulk", data);
}
