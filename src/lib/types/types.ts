/**
 * TypeScript Types for Backend API
 *
 * All types match the backend FastAPI schemas
 */

// ============================================
// PROGRAMS
// ============================================

export interface Program {
  id: number;
  code: string;
  name: string;
  faculty: string;
  degree_level: string;
  total_credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramVersion {
  id: number;
  program_id: number;
  version_number: number;
  effective_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramWithActiveVersion {
  program: Program;
  active_version: ProgramVersion | null;
}

// ============================================
// PROFILES
// ============================================

export interface ProfileStatus {
  exists: boolean;
  onboarding_step: number;
  student_id: string | null;
  program_code: string | null;
  program_name: string | null;
}

export interface Profile {
  id: number;
  user_id: string;
  student_id: string;
  program_id: number;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithProgram {
  id: number;
  user_id: string;
  student_id: string;
  program_id: number;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
  program: Program;
}

export interface CreateProfileRequest {
  student_id: string;
  program_code?: string;
  program_id?: number;
}

export interface UpdateProfileRequest {
  student_id?: string;
  program_id?: number;
}

// ============================================
// HISTORY (Academic History)
// ============================================

export interface CourseHistory {
  id: number;
  user_id: string;
  course_code: string;
  course_name: string;
  credits: number;
  grade: number | null;
  semester: string | null;
  year: number | null;
  status: "approved" | "failed" | "in_progress" | "pending";
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportPreviewCourse {
  course_code: string;
  course_name: string;
  credits: number;
  grade: number | null;
  semester: string | null;
  year: number | null;
  status: "approved" | "failed" | "in_progress" | "pending";
}

export interface ImportPreviewResponse {
  success: boolean;
  total_courses: number;
  approved_courses: number;
  failed_courses: number;
  in_progress_courses: number;
  courses: ImportPreviewCourse[];
  warnings: string[];
}

export interface ImportHistoryRequest {
  history_text: string;
}

export interface ImportCommitRequest {
  history_text: string;
}

export interface ImportCommitResponse {
  success: boolean;
  message: string;
  imported_count: number;
  courses: CourseHistory[];
}

export interface CreateManualHistoryRequest {
  course_code: string;
  course_name: string;
  credits: number;
  grade?: number | null;
  semester?: string | null;
  year?: number | null;
  status: "approved" | "failed" | "in_progress" | "pending";
}

export interface UpdateManualHistoryRequest {
  course_code?: string;
  course_name?: string;
  credits?: number;
  grade?: number | null;
  semester?: string | null;
  year?: number | null;
  status?: "approved" | "failed" | "in_progress" | "pending";
}

// ============================================
// AUTHENTICATION (Neon Auth)
// ============================================

export interface NeonUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NeonSession {
  token: string;
  user: NeonUser;
  expiresAt: Date;
}

// ============================================
// API RESPONSES
// ============================================

export interface APIErrorResponse {
  detail: string;
  status?: number;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ============================================
// PAGINATION
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
