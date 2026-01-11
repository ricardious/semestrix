import { useNavigate } from "react-router-dom";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";
import { useMyHistory } from "@services/history/queries";
import SvgIcon from "@atoms/SvgIcon";
import { Img } from "react-image";
import type { User } from "@lib/types/api";
import type { AcademicProfile } from "@lib/types/api";

interface DashboardHeaderProps {
  user: User | null;
  userProfile: AcademicProfile;
  currentSemester: number;
  programName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  currentSemester,
  programName = "Tu Carrera",
}) => {
  const navigate = useNavigate();
  const { signOut } = useNeonAuth();
  const { data: history = [] } = useMyHistory();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const calculateCurrentAcademicYear = () => {
    // Simple calculation based on history length
    return Math.max(1, Math.floor(history.length / 8) + 1);
  };

  const getProgressStats = () => {
    const approvedCourses = history.filter(
      (h) => h.status === "approved"
    ).length;
    const totalCreditsCompleted = approvedCourses * 4; // Assuming 4 credits per course

    const totalCredits = 300; // Default, can be fetched from program
    const progressPercentage = Math.min(
      (totalCreditsCompleted / totalCredits) * 100,
      100
    );

    return {
      completedCourses: approvedCourses,
      completedCredits: totalCreditsCompleted,
      totalCredits,
      progressPercentage: Math.round(progressPercentage),
    };
  };

  const stats = getProgressStats();
  const currentAcademicYear = calculateCurrentAcademicYear();

  return (
    <header className="bg-white/70 dark:bg-gray-800/70 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg"></div>

              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-primary/30">
                <Img
                  src="/icons/favicon.svg"
                  alt="Semestrix Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 group-hover:rotate-6"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Semestrix
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Panel Académico
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {currentAcademicYear}° Año
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {currentSemester === 1 ? "Primer" : "Segundo"} Sem.
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {stats.completedCourses}
                </p>
                <p className="text-gray-500 dark:text-gray-400">Materias</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {stats.progressPercentage}%
                </p>
                <p className="text-gray-500 dark:text-gray-400">Progreso</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || user?.email?.split("@")[0] || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {programName}
                  </p>
                </div>

                <div className="relative group">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-secondary p-0.5">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <SvgIcon
                          name="user"
                          size="sm"
                          className="text-gray-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => navigate("/onboarding")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <SvgIcon name="settings" size="sm" />
                        <span>Editar Perfil</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <SvgIcon name="logout" size="sm" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Progreso de Carrera
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {stats.completedCredits} / {stats.totalCredits} créditos
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
