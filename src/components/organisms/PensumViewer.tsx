import React, { useState } from "react";
import { Course } from "@/services/academic/api";
import LoadingSpinner from "@atoms/LoadingSpinner";
import SvgIcon from "@atoms/SvgIcon";

interface PensumViewerProps {
  pensum: Course[];
  completedCourses: string[];
  loading: boolean;
}

const PensumViewer: React.FC<PensumViewerProps> = ({
  pensum,
  completedCourses,
  loading,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

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

  const getStats = () => {
    const totalCourses = pensum.length;
    const completedCount = pensum.filter((course) =>
      completedCourses.includes(course.code)
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
      completedCourses.includes(course.code)
    ).length;
    const total = semesterCourses.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Resumen de tu Pensum
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SvgIcon name="write-book" size="lg" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalCourses}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Total de Materias
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SvgIcon name="circle-check" size="lg" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.completedCount}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Completadas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SvgIcon name="circle-clock" size="lg" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.remainingCount}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Pendientes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SvgIcon
                name="graph-bar-increase"
                size="lg"
                className="text-white"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.progressPercentage}%
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Progreso</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Progreso General
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {stats.completedCount} / {stats.totalCourses} materias
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pensum por Semestres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: totalSemesters }, (_, i) => i + 1).map(
            (semester) => {
              const semesterStats = getSemesterStats(semester);
              const isSelected = selectedSemester === semester;

              return (
                <button
                  key={semester}
                  onClick={() =>
                    setSelectedSemester(isSelected ? null : semester)
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Semestre {semester}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {semesterStats.completed} / {semesterStats.total} materias
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${semesterStats.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {semesterStats.percentage}%
                    </div>
                  </div>
                </button>
              );
            }
          )}
        </div>

        {selectedSemester && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Materias del {selectedSemester}° Semestre
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {coursesBySemester[selectedSemester]?.map((course) => {
                const isCompleted = completedCourses.includes(course.code);

                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCompleted
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {course.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
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
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isCompleted && <SvgIcon name="check" size="sm" />}
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
  );
};

export default PensumViewer;
