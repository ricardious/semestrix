import React from "react";
import LoadingSpinner from "@atoms/LoadingSpinner";
import SvgIcon from "@atoms/SvgIcon";
import SemesterCourses from "@molecules/SemesterCourses";
import { Course } from "@/services/academic/api";

interface OnboardingData {
  career: string;
  startYear: number;
  semester: number;
  completedCourses: string[];
}

interface CourseSelectionProps {
  pensum: Course[];
  loadingPensum: boolean;
  formData: OnboardingData;
  expandedSemesters: Set<number>;
  onExpandedSemestersChange: (semesters: Set<number>) => void;
  onFormUpdate: (updates: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({
  pensum,
  loadingPensum,
  formData,
  expandedSemesters,
  onExpandedSemestersChange,
  onFormUpdate,
  onBack,
  onSubmit,
  loading,
}) => {
  // Agrupar cursos por semestre
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

  const handleCourseToggle = (courseId: string) => {
    // Buscar el curso para obtener su código
    const course = pensum.find((c) => c.id === courseId);
    if (!course) return;

    const courseCode = course.code;
    const isSelected = formData.completedCourses.includes(courseCode);

    const updatedCourses = isSelected
      ? formData.completedCourses.filter((code) => code !== courseCode)
      : [...formData.completedCourses, courseCode];

    onFormUpdate({ completedCourses: updatedCourses });
  };

  const toggleSemester = (semester: number) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semester)) {
      newExpanded.delete(semester);
    } else {
      newExpanded.add(semester);
    }
    onExpandedSemestersChange(newExpanded);
  };

  const selectAllSemesterCourses = (semester: number) => {
    const semesterCourses = pensum.filter(
      (course) => course.semester === semester
    );
    const semesterCourseCodes = semesterCourses.map((course) => course.code);
    const allSelected = semesterCourseCodes.every((code) =>
      formData.completedCourses.includes(code)
    );

    if (allSelected) {
      const updatedCourses = formData.completedCourses.filter(
        (code) => !semesterCourseCodes.includes(code)
      );
      onFormUpdate({ completedCourses: updatedCourses });
    } else {
      const updatedCourses = [
        ...new Set([...formData.completedCourses, ...semesterCourseCodes]),
      ];
      onFormUpdate({ completedCourses: updatedCourses });
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Selecciona las materias que ya has completado
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Esto nos ayuda a personalizar tu experiencia y mostrarte el
            contenido más relevante.
          </p>
        </div>

        {loadingPensum ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {Array.from({ length: totalSemesters }, (_, i) => i + 1).map(
              (semester) => (
                <SemesterCourses
                  key={semester}
                  semester={semester}
                  courses={coursesBySemester[semester] || []}
                  completedCourses={formData.completedCourses}
                  isExpanded={expandedSemesters.has(semester)}
                  onToggleSemester={() => toggleSemester(semester)}
                  onSelectAllCourses={() => selectAllSemesterCourses(semester)}
                  onCourseToggle={handleCourseToggle}
                />
              )
            )}
          </div>
        )}

        <div className="flex space-x-6 mt-10">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-8 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
          >
            <SvgIcon name="arrow-left" size="sm" />
            <span>Atrás</span>
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Configurando...</span>
              </>
            ) : (
              <>
                <span>Finalizar configuración</span>
                <SvgIcon name="check" size="sm" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
