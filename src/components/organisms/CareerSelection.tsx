import React from "react";
import { Career } from "@/services/academic/api";

interface CareerSelectionProps {
  careers: Career[];
  onCareerSelect: (careerId: string) => void;
}

const CareerSelection: React.FC<CareerSelectionProps> = ({
  careers,
  onCareerSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {careers.map((career) => (
        <button
          key={career.id}
          onClick={() => onCareerSelect(career.id)}
          className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-all duration-300 text-left group hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-secondary transition-all duration-300">
              <span className="text-2xl font-bold text-secondary group-hover:text-white transition-colors duration-300">
                {career.code}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                {career.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Código: {career.code}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CareerSelection;
