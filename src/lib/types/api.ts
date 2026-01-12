/**
 * TypeScript Type Definitions
 *
 * Types for backend API responses and domain entities.
 */

// ============================================================================
// PROGRAMS
// ============================================================================

export interface Program {
  program_id: number;
  program_code: string;
  program_name: string;
  description?: string | null;
  creation_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CurriculumVersion {
  version_id: number;
  program_id: number;
  version_year: number;
  status: "active" | "inactive" | "deprecated";
  created_at: string;
  updated_at: string;
}

export interface ProgramsListResponse {
  total: number;
  programs: Program[];
}

export interface ActiveVersionResponse extends CurriculumVersion {
  program: Program;
}

// ============================================================================
// PROFILES
// ============================================================================

export interface ProfileStatus {
  has_profile: boolean;
  onboarding_step: number;
  profile_id?: string;
  student_id?: string | null;
  career_code?: string | null;
}

export interface AcademicProfile {
  profile_id: string;
  user_id: string;
  student_id: string | null;
  current_program_id: number | null;
  current_version_id: number | null;
  current_semester: number | null;
  onboarding_step: number;
}

export interface CreateIdentityRequest {
  student_id: string;
  career_code?: string;
  program_id?: number;
}

export interface ProfileResponse extends AcademicProfile {}

// ============================================================================
// HISTORY
// ============================================================================

export interface HistoryItem {
  history_id: number;
  course_id: number;
  year: number;
  term: number;
  grade: number | null;
  status: string;
  professor_name: string | null;
  created_at: string;
  updated_at: string;
  course_code: string;
  course_name: string;
}

export interface HistoryListResponse {
  total: number;
  items: HistoryItem[];
}

export interface NormalizedItem {
  course_code: string;
  course_name: string;
  year: number;
  term: number;
  grade: number | null;
  status: string;
  professor_name: string | null;
}

export interface ImportPreviewRequest {
  raw_text: string;
  fallback_year?: number;
  fallback_term?: number;
}

export interface ImportPreviewResponse {
  rows_parsed: number;
  missing_grades: number;
  avg_grade: number | null;
  items: NormalizedItem[];
  errors: string[];
}

export interface ImportCommitRequest {
  items: NormalizedItem[];
}

export interface ImportCommitResponse {
  inserted_or_updated: number;
  created_courses: number;
  missing_grades: number;
  errors: any[];
}

export interface ManualCreateRequest {
  course_code?: string;
  course_id?: number;
  year: number;
  term: number;
  grade?: number | null;
  status: string;
  professor_name?: string | null;
}

export interface ManualUpdateRequest {
  course_code?: string;
  course_id?: number;
  year?: number;
  term?: number;
  grade?: number | null;
  status?: string;
  professor_name?: string | null;
}

// ============================================================================
// AUTH
// ============================================================================

export interface User {
  id: string;
  email: string;
  name?: string | null;
  emailVerified?: boolean;
  image?: string | null;
}

export interface Session {
  user: User;
  accessToken: string;
  expiresAt?: number;
}

// ============================================================================
// API ERRORS
// ============================================================================

export interface APIErrorResponse {
  detail: string;
  status_code?: number;
}

// ============================================================================
// COURSES
// ============================================================================

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
}

export interface CoursesPageResponse {
  items: Course[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// CURRICULUM STRUCTURE (NEW)
// ============================================================================

export interface RequirementRule {
  type: "prerequisite" | "corequisite" | "concurrent" | "credit";
  value: number;
}

export interface CurriculumCourseNode {
  curriculum_course_id: number; // Added this too as it was in backend changes
  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  is_mandatory: boolean;
  suggested_semester: number | null;
  display_order: number | null;
  requirements: RequirementRule[];
}

export interface CurriculumSemester {
  semester: number;
  total_credits: number;
  courses: CurriculumCourseNode[];
}

export interface CurriculumStructure {
  version_id: number;
  program_id: number;
  version_year: number;
  semesters: CurriculumSemester[];
}

// ============================================================================
// BULK HISTORY (NEW)
// ============================================================================

export interface HistoryBulkItem {
  course_code: string;
  year?: number | null;
  term?: number | null;
  grade?: number | null;
  status: "passed" | "failed" | "in_progress" | "withdrawn" | "pending";
  professor_name?: string | null;
}

export interface HistoryBulkRequest {
  items: HistoryBulkItem[];
}

export interface HistoryBulkError {
  index: number;
  course_code: string;
  reason: string;
}

export interface HistoryBulkResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: HistoryBulkError[];
}
