import { useState } from "react";
import { Course } from "@/services/academic/api";
import LoadingSpinner from "@atoms/LoadingSpinner";
import SvgIcon from "@atoms/SvgIcon";

interface PensumViewerProps {
  pensum: Course[];
  completedCourses: string[];
  loading: boolean;
  onCoursesUpdate?: (courses: string[]) => void;
}

const PensumViewer: React.FC<PensumViewerProps> = ({
  pensum,
  completedCourses,
  loading,
  onCoursesUpdate,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempCompletedCourses, setTempCompletedCourses] =
    useState<string[]>(completedCourses);

  const coursesBySemester = pensum.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<number, Course[]>);

  const totalSemesters = Math.max(
    ...Object.keys(coursesBySemester).map(Number)
  );

  const handleCourseToggle = (courseCode: string) => {
    if (!isEditMode) return;

    setTempCompletedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const handleSaveChanges = () => {
    onCoursesUpdate?.(tempCompletedCourses);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setTempCompletedCourses(completedCourses);
    setIsEditMode(false);
  };

  const handleStartEdit = () => {
    setTempCompletedCourses(completedCourses);
    setIsEditMode(true);
  };

  const activeCourses = isEditMode ? tempCompletedCourses : completedCourses;

  const getStats = () => {
    const totalCourses = pensum.length;
    const completedCount = pensum.filter((course) =>
      activeCourses.includes(course.code)
    ).length;
    const remainingCount = totalCourses - completedCount;
    const progressPercentage =
      totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

    return {
      totalCourses,
      completedCount,
      remainingCount,
      progressPercentage,
    };
  };

  const stats = getStats();

  const getSemesterStats = (semester: number) => {
    const semesterCourses = coursesBySemester[semester] || [];
    const completed = semesterCourses.filter((course) =>
      activeCourses.includes(course.code)
    ).length;
    const total = semesterCourses.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const renderMobileSemesterDetails = (semester: number) => {
    if (selectedSemester !== semester) return null;

    return (
      <div className="mt-4 p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-200/30 dark:border-gray-700/30 md:hidden">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Materias del {semester}° Semestre
        </h4>
        <div className="space-y-2">
          {coursesBySemester[semester]?.map((course) => {
            const isCompleted = activeCourses.includes(course.code);

            return (
              <div key={course.id} className="relative group/course">
                <div
                  className={`absolute inset-0 rounded-lg transition-all duration-300 blur-md ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500/15 to-green-600/15 opacity-100"
                      : isEditMode
                      ? "bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover/course:opacity-100"
                      : "opacity-0"
                  }`}
                ></div>

                <div
                  onClick={() => handleCourseToggle(course.code)}
                  className={`relative p-2 rounded-lg border transition-all duration-300 backdrop-blur-md ${
                    isEditMode
                      ? "cursor-pointer hover:shadow-sm hover:scale-[1.01]"
                      : ""
                  } ${
                    isCompleted
                      ? "border-green-200/40 bg-green-50/60 dark:border-green-800/40 dark:bg-green-900/15"
                      : "border-gray-200/40 dark:border-gray-600/40 bg-gray-50/60 dark:bg-gray-700/40"
                  } ${
                    isEditMode && !isCompleted
                      ? "hover:border-green-300/40 hover:bg-green-50/40 dark:hover:border-green-700/40 dark:hover:bg-green-900/8"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1 text-xs truncate">
                        {course.name}
                      </h5>
                      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono font-semibold">
                          {course.code}
                        </span>
                        <span>{course.credits} créditos</span>
                        {course.type && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              course.type === "Obligatorio"
                                ? "bg-blue-100/60 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                : "bg-purple-100/60 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                            }`}
                          >
                            {course.type}
                          </span>
                        )}
                      </div>
                      {course.prerequisites &&
                        course.prerequisites.length > 0 && (
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Prerrequisitos:</span>{" "}
                            <span className="break-words">
                              {course.prerequisites.join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="relative group/checkbox ml-2">
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-300 blur-sm ${
                          isCompleted
                            ? "bg-green-500/15 opacity-100"
                            : isEditMode
                            ? "bg-primary/15 opacity-0 group-hover/checkbox:opacity-100"
                            : "opacity-0"
                        }`}
                      ></div>

                      <div
                        className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "border-green-500 bg-green-500 text-white shadow-md"
                            : isEditMode
                            ? "border-gray-400 dark:border-gray-500 hover:border-green-400 hover:bg-green-50/50 dark:hover:border-green-600 hover:scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isCompleted && (
                          <SvgIcon
                            name="check"
                            size="sm"
                            className="w-2.5 h-2.5"
                          />
                        )}
                        {isEditMode && !isCompleted && (
                          <div className="w-1 h-1 bg-gray-400 rounded-full opacity-50 group-hover/checkbox:opacity-100 transition-opacity"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resumen Section */}
      <div className="relative group">
        <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-700/30 p-4 sm:p-6 transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/15">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Resumen de tu Pensum
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center">
              <div className="relative group/stat">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-300 group-hover/stat:scale-105">
                  <SvgIcon
                    name="write-book"
                    size="md"
                    className="text-white sm:w-6 sm:h-6"
                  />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalCourses}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Total de Materias
              </p>
            </div>

            <div className="text-center">
              <div className="relative group/stat">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-300 group-hover/stat:scale-105">
                  <SvgIcon
                    name="circle-check"
                    size="md"
                    className="text-white sm:w-6 sm:h-6"
                  />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedCount}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Completadas
              </p>
            </div>

            <div className="text-center">
              <div className="relative group/stat">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-300 group-hover/stat:scale-105">
                  <SvgIcon
                    name="circle-clock"
                    size="md"
                    className="text-white sm:w-6 sm:h-6"
                  />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.remainingCount}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Pendientes
              </p>
            </div>

            <div className="text-center">
              <div className="relative group/stat">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-300 group-hover/stat:scale-105">
                  <SvgIcon
                    name="graph-bar-increase"
                    size="md"
                    className="text-white sm:w-6 sm:h-6"
                  />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.progressPercentage}%
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Progreso
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Progreso General
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {stats.completedCount} / {stats.totalCourses} materias
              </span>
            </div>
            <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-2 sm:h-3 overflow-hidden backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${stats.progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pensum Section */}
      <div className="relative group">
        <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-700/30 p-4 sm:p-6 transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Pensum por Semestres
            </h2>

            {!isEditMode ? (
              <div className="relative group/button">
                <button
                  onClick={handleStartEdit}
                  className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary/90 text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm border border-primary/20 group-hover/button:shadow-lg"
                >
                  <SvgIcon name="edit" size="sm" />
                  <span>Editar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <div className="relative group/save">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-lg opacity-0 group-hover/save:opacity-100 transition-all duration-300 blur-sm"></div>
                  <button
                    onClick={handleSaveChanges}
                    className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600/90 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm border border-green-600/20 group-hover/save:shadow-lg"
                  >
                    <SvgIcon name="data-check" size="sm" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50/60 dark:bg-blue-900/15 backdrop-blur-lg rounded-lg border border-blue-200/30 dark:border-blue-800/30">
              <div className="flex items-start space-x-2 text-blue-800 dark:text-blue-200">
                <SvgIcon
                  name="info"
                  size="sm"
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Modo edición: Haz clic en las materias para marcarlas como
                  completadas o pendientes
                </span>
              </div>
            </div>
          )}

          {/* Mobile Layout */}
          <div className="space-y-4 md:hidden">
            {Array.from({ length: totalSemesters }, (_, i) => i + 1).map(
              (semester) => {
                const semesterStats = getSemesterStats(semester);
                const isSelected = selectedSemester === semester;

                return (
                  <div key={semester} className="relative">
                    <div className="relative group/semester">
                      <div
                        className={`absolute inset-0 rounded-xl transition-all duration-300 blur-lg ${
                          isSelected
                            ? "bg-gradient-to-br from-primary/15 to-secondary/15 opacity-100"
                            : "bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover/semester:opacity-100"
                        }`}
                      ></div>

                      <button
                        onClick={() =>
                          setSelectedSemester(isSelected ? null : semester)
                        }
                        className={`relative w-full p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-lg ${
                          isSelected
                            ? "border-primary/40 bg-primary/8 dark:bg-primary/15 shadow-lg scale-[1.02]"
                            : "border-gray-200/40 dark:border-gray-600/40 hover:border-gray-300/40 dark:hover:border-gray-500/40 bg-white/40 dark:bg-gray-800/40 hover:scale-[1.01] hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                              Semestre {semester}
                            </h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {semesterStats.completed} / {semesterStats.total}{" "}
                              materias completadas
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {semesterStats.percentage}%
                            </div>
                            <div className="w-16 bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 relative overflow-hidden"
                                style={{
                                  width: `${semesterStats.percentage}%`,
                                }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                    {renderMobileSemesterDetails(semester)}
                  </div>
                );
              }
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: totalSemesters }, (_, i) => i + 1).map(
                (semester) => {
                  const semesterStats = getSemesterStats(semester);
                  const isSelected = selectedSemester === semester;

                  return (
                    <div key={semester} className="relative group/semester">
                      <div
                        className={`absolute inset-0 rounded-xl transition-all duration-300 blur-lg ${
                          isSelected
                            ? "bg-gradient-to-br from-primary/15 to-secondary/15 opacity-100"
                            : "bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover/semester:opacity-100"
                        }`}
                      ></div>

                      <button
                        onClick={() =>
                          setSelectedSemester(isSelected ? null : semester)
                        }
                        className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-lg ${
                          isSelected
                            ? "border-primary/40 bg-primary/8 dark:bg-primary/15 shadow-lg scale-105"
                            : "border-gray-200/40 dark:border-gray-600/40 hover:border-gray-300/40 dark:hover:border-gray-500/40 bg-white/40 dark:bg-gray-800/40 hover:scale-102 hover:shadow-md"
                        }`}
                      >
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">
                            Semestre {semester}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {semesterStats.completed} / {semesterStats.total}{" "}
                            materias
                          </div>
                          <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 relative overflow-hidden"
                              style={{ width: `${semesterStats.percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {semesterStats.percentage}%
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            {selectedSemester && (
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Materias del {selectedSemester}° Semestre
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {coursesBySemester[selectedSemester]?.map((course) => {
                    const isCompleted = activeCourses.includes(course.code);

                    return (
                      <div key={course.id} className="relative group/course">
                        <div
                          className={`absolute inset-0 rounded-lg transition-all duration-300 blur-lg ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-500/15 to-green-600/15 opacity-100"
                              : isEditMode
                              ? "bg-gradient-to-br from-primary/8 to-secondary/8 opacity-0 group-hover/course:opacity-100"
                              : "opacity-0"
                          }`}
                        ></div>

                        <div
                          onClick={() => handleCourseToggle(course.code)}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
                            isEditMode
                              ? "cursor-pointer hover:shadow-md hover:scale-102"
                              : ""
                          } ${
                            isCompleted
                              ? "border-green-200/40 bg-green-50/60 dark:border-green-800/40 dark:bg-green-900/15"
                              : "border-gray-200/40 dark:border-gray-600/40 bg-gray-50/60 dark:bg-gray-700/40"
                          } ${
                            isEditMode && !isCompleted
                              ? "hover:border-green-300/40 hover:bg-green-50/40 dark:hover:border-green-700/40 dark:hover:bg-green-900/8"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-base truncate">
                                {course.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-mono font-semibold">
                                  {course.code}
                                </span>
                                <span>•</span>
                                <span>{course.credits} créditos</span>
                                {course.type && (
                                  <>
                                    <span>•</span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.type === "Obligatorio"
                                          ? "bg-blue-100/60 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                          : "bg-purple-100/60 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                                      }`}
                                    >
                                      {course.type}
                                    </span>
                                  </>
                                )}
                              </div>
                              {course.prerequisites &&
                                course.prerequisites.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">
                                      Prerrequisitos:
                                    </span>{" "}
                                    {course.prerequisites.join(", ")}
                                  </div>
                                )}
                            </div>
                            <div className="relative group/checkbox ml-3">
                              <div
                                className={`absolute inset-0 rounded-full transition-all duration-300 blur-sm ${
                                  isCompleted
                                    ? "bg-green-500/15 opacity-100"
                                    : isEditMode
                                    ? "bg-primary/15 opacity-0 group-hover/checkbox:opacity-100"
                                    : "opacity-0"
                                }`}
                              ></div>

                              <div
                                className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                  isCompleted
                                    ? "border-green-500 bg-green-500 text-white shadow-lg"
                                    : isEditMode
                                    ? "border-gray-400 dark:border-gray-500 hover:border-green-400 hover:bg-green-50 dark:hover:border-green-600 hover:scale-110"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isCompleted && (
                                  <SvgIcon name="check" size="sm" />
                                )}
                                {isEditMode && !isCompleted && (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full opacity-50 group-hover/checkbox:opacity-100 transition-opacity"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensumViewer;
