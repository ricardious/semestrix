import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import CourseItem from "@atoms/CourseItem";
import { Course } from "@/services/academic/api";

interface SemesterCoursesProps {
  semester: number;
  courses: Course[];
  completedCourses: string[];
  isExpanded: boolean;
  onToggleSemester: () => void;
  onSelectAllCourses: () => void;
  onCourseToggle: (courseId: string) => void;
}

const SemesterCourses: React.FC<SemesterCoursesProps> = ({
  semester,
  courses,
  completedCourses,
  isExpanded,
  onToggleSemester,
  onSelectAllCourses,
  onCourseToggle,
}) => {
  const completedInSemester = courses.filter((course) =>
    completedCourses.includes(course.code)
  ).length;
  const allSemesterCompleted =
    courses.length > 0 && completedInSemester === courses.length;

  if (courses.length === 0) return null;

  return (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl overflow-hidden">
      {/* Semester Header */}
      <div
        className="flex items-center justify-between p-3 sm:p-4 md:p-5 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        onClick={onToggleSemester}
      >
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
              allSemesterCompleted
                ? "bg-green-500 text-white"
                : completedInSemester > 0
                ? "bg-yellow-500 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}
          >
            {semester}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium sm:font-semibold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg truncate">
              {semester}° Semestre
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">
                {completedInSemester}/{courses.length} materias completadas
              </span>
              <span className="sm:hidden">
                {completedInSemester}/{courses.length}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectAllCourses();
            }}
            className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary text-white hover:opacity-80 transition-opacity font-medium"
          >
            <span className="hidden sm:inline">
              {allSemesterCompleted ? "Deseleccionar todo" : "Seleccionar todo"}
            </span>
            <span className="sm:hidden">
              {allSemesterCompleted ? "Quitar" : "Todo"}
            </span>
          </button>

          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
            <SvgIcon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size="sm"
              className="text-gray-400 transition-transform duration-200"
            />
          </div>
        </div>
      </div>

      {/* Semester Courses */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-600"
          >
            <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {courses.map((course) => (
                  <CourseItem
                    key={course.id}
                    course={course}
                    isSelected={completedCourses.includes(course.code)}
                    onToggle={() => onCourseToggle(course.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterCourses;
