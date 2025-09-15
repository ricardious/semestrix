import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SvgIcon from '@atoms/SvgIcon';
import CourseItem from '@atoms/CourseItem';
import { Course } from '@/services/academic/api';

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
  onCourseToggle
}) => {
  const completedInSemester = courses.filter(course => 
    completedCourses.includes(course.code)
  ).length;
  const allSemesterCompleted = courses.length > 0 && 
    completedInSemester === courses.length;

  if (courses.length === 0) return null;

  return (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
      {/* Semester Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        onClick={onToggleSemester}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            allSemesterCompleted 
              ? 'bg-green-500 text-white' 
              : completedInSemester > 0 
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            {semester}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {semester}° Semestre
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedInSemester}/{courses.length} materias completadas
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectAllCourses();
            }}
            className="text-xs px-3 py-1 rounded-full bg-primary text-white hover:opacity-80 transition-opacity"
          >
            {allSemesterCompleted ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
          <SvgIcon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size="sm" 
            className="text-gray-400 transition-transform duration-200" 
          />
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
            <div className="p-4 space-y-3">
              {courses.map((course) => (
                <CourseItem
                  key={course.id}
                  course={course}
                  isSelected={completedCourses.includes(course.code)}
                  onToggle={() => onCourseToggle(course.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterCourses;
