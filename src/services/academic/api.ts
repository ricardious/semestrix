// Neon Database API Configuration
const NEON_API_BASE = "https://app-delicate-queen-42311126.dpl.myneon.app";

export interface Career {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  career_id: string;
  prerequisites?: string[];
  description?: string;
  type?: "Obligatorio" | "Electivo";
  display_order?: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  career_id: string;
  start_year: number;
  current_semester: number;
  completed_courses: string[];
  created_at: string;
  updated_at: string;
}

// API Helper function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${NEON_API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getCareers = async (): Promise<Career[]> => {
  try {
    const programs = await apiRequest(
      "/programs?select=program_code,program_name&order=program_code.asc"
    );

    // Transform the API response to match our Career interface
    const careers: Career[] = programs.map((program: any) => ({
      id: program.program_code,
      name: program.program_name,
      code: program.program_code,
      description: program.program_name,
    }));

    return careers;
  } catch (error) {
    console.error("Error fetching careers:", error);
    // Fallback
    return [
      { id: "09", name: "INGENIERÍA EN CIENCIAS Y SISTEMAS", code: "09" },
      { id: "01", name: "INGENIERÍA CIVIL", code: "01" },
      { id: "03", name: "INGENIERÍA MECÁNICA", code: "03" },
      { id: "04", name: "INGENIERÍA ELÉCTRICA", code: "04" },
      { id: "05", name: "INGENIERÍA INDUSTRIAL", code: "05" },
    ];
  }
};

export const getPensum = async (
  careerId: string,
  versionYear?: number
): Promise<Course[]> => {
  const currentYear = versionYear || new Date().getFullYear();
  const url = `/rpc/pensum?p_code=${careerId}&p_year=${currentYear}`;

  const response = await apiRequest(url, {
    method: 'GET'
  });

  const courses = response;

  const transformedCourses: Course[] = courses.map((course: any, index: number) => ({
    id: course.curriculum_course_id?.toString() || `${careerId}-${index}`,
    code: course.course_code,
    name: course.course_name,
    credits: course.credits,
    semester: course.suggested_semester,
    career_id: careerId,
    prerequisites: course.prerequisites && course.prerequisites !== 'Ninguno' 
      ? course.prerequisites.split(', ').map((code: string) => code.trim())
      : [],
    type: course.type as 'Obligatorio' | 'Electivo',
    display_order: course.display_order || index + 1
  }));

  return transformedCourses;
};

export const saveUserProfile = async (
  profileData: Omit<UserProfile, "id" | "created_at" | "updated_at">
): Promise<UserProfile> => {
  try {
    const profile = await apiRequest("/user-profiles", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
    return profile;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const profile = await apiRequest(`/user-profiles/user/${userId}`);
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  profileId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const profile = await apiRequest(`/user-profiles/${profileId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return profile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
