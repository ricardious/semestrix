/**
 * Programs API Service
 *
 * API functions for interacting with the programs endpoint.
 */
import { api } from "../apiClient";
import type {
  Program,
  ProgramsListResponse,
  ActiveVersionResponse,
  CurriculumStructure,
} from "../../lib/types/api";

/**
 * Get all academic programs
 */
export async function getPrograms(): Promise<Program[]> {
  const response = await api.get<ProgramsListResponse>("/programs");
  return response.programs;
}

/**
 * Get active curriculum version for a program
 */
export async function getActiveCurriculumVersion(
  programCode: string
): Promise<ActiveVersionResponse | null> {
  try {
    return await api.get<ActiveVersionResponse>(
      `/programs/${programCode}/active-version`
    );
  } catch (error) {
    // Return null if no active version found (404)
    return null;
  }
}

/**
 * Get curriculum structure by version ID
 */
export const getCurriculumStructure = async (
  versionId: number
): Promise<CurriculumStructure> => {
  return await api.get<CurriculumStructure>(
    `/programs/curriculums/${versionId}/structure`
  );
};
