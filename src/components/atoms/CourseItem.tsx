import React from "react";
import { motion } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import { Course } from "@/services/academic/api";

interface CourseItemProps {
  course: Course;
  isSelected: boolean;
  onToggle: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  course,
  isSelected,
  onToggle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15"
          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
        {/* Left side */}
        <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 sm:mt-0 ${
              isSelected
                ? "border-primary bg-primary text-white"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {isSelected && (
              <SvgIcon name="check" className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base leading-tight truncate">
              {course.name}
            </h5>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                {course.code}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex-shrink-0">{course.credits} créditos</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        {course.type && (
          <div className="flex-shrink-0">
            <span
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                course.type === "Obligatorio"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800"
              }`}
            >
              <span className="hidden sm:inline">{course.type}</span>
              <span className="sm:hidden">
                {course.type === "Obligatorio" ? "Obl." : "Elect."}
              </span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseItem;
