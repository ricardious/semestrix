import React from 'react';
import { motion } from 'framer-motion';
import SvgIcon from '@atoms/SvgIcon';
import { Course } from '@/services/academic/api';

interface CourseItemProps {
  course: Course;
  isSelected: boolean;
  onToggle: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({ course, isSelected, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'border-primary bg-primary text-white' 
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {isSelected && <SvgIcon name="check" />}
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">
              {course.name}
            </h5>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                {course.code}
              </span>
              <span>•</span>
              <span>{course.credits} créditos</span>
            </div>
          </div>
        </div>
        
        {/* Badge del tipo de materia */}
        <div className="flex items-center space-x-2">
          {course.type && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.type === 'Obligatorio' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800'
            }`}>
              {course.type}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseItem;