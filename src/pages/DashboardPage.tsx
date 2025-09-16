import { useState, useEffect } from "react";
import { useCurrentUser } from "@services/auth/queries";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@atoms/LoadingSpinner";
import {
  getUserProfile,
  updateUserProfile,
} from "@/services/firebase/profiles";
import { getPensum, Course } from "@/services/academic/api";
import DashboardHeader from "@organisms/DashboardHeader";
import PensumViewer from "@organisms/PensumViewer";
import ScheduleGenerator from "@organisms/ScheduleGenerator";

interface FirebaseUser {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}

interface UserProfile {
  uid: string;
  career_id: string;
  career_name: string;
  start_year: number;
  completed_courses: string[];
  onboarding_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser() as { data: FirebaseUser | null };
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pensum, setPensum] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"pensum" | "schedule">("pensum");
  const [loadingPensum, setLoadingPensum] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        navigate("/onboarding");
        return;
      }

      try {
        // Cargar perfil del usuario
        const profile = await getUserProfile(user.uid);

        if (!profile || !profile.onboarding_completed) {
          navigate("/onboarding");
          return;
        }

        setUserProfile(profile);

        // Cargar pensum
        setLoadingPensum(true);
        const pensumData = await getPensum(
          profile.career_id,
          profile.start_year
        );
        setPensum(pensumData);
      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
        navigate("/onboarding");
      } finally {
        setLoading(false);
        setLoadingPensum(false);
      }
    };

    loadUserData();
  }, [user, navigate]);
  const getCurrentSemester = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    return month >= 1 && month <= 6 ? 1 : 2;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cargando tu información académica
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Estamos preparando tu pensum y horarios disponibles...
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No se encontró tu perfil
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
            Parece que no has completado el proceso de configuración inicial.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Completar configuración
          </button>
        </div>
      </div>
    );
  }

  const handleCoursesUpdate = async (newCompletedCourses: string[]) => {
    try {
      if (!user?.uid) return;

      // Actualizar en Firebase
      await updateUserProfile(user.uid, {
        completed_courses: newCompletedCourses,
      });

      // Actualizar estado local
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              completed_courses: newCompletedCourses,
            }
          : null
      );
    } catch (error) {
      console.error("Error actualizando cursos:", error);
      // Aquí podrías mostrar un toast o notificación de error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        user={user}
        userProfile={userProfile}
        currentSemester={getCurrentSemester()}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pensum")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "pensum"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Mi Pensum
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "schedule"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Generar Horario
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "pensum" && (
          <PensumViewer
            pensum={pensum}
            completedCourses={userProfile.completed_courses}
            loading={loadingPensum}
            onCoursesUpdate={handleCoursesUpdate}
          />
        )}
        {activeTab === "schedule" && (
          <ScheduleGenerator
            pensum={pensum}
            completedCourses={userProfile.completed_courses}
            currentSemester={getCurrentSemester()}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
