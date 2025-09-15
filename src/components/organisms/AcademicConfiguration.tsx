import React from "react";
import SvgIcon from "@atoms/SvgIcon";
import Select from "@atoms/Select";
import { Career } from "@services/academic/api";

interface OnboardingData {
  career: string;
  startYear: number;
  semester: number;
  completedCourses: string[];
}

interface AcademicConfigurationProps {
  formData: OnboardingData;
  availableCareers: Career[];
  onFormUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AcademicConfiguration: React.FC<AcademicConfigurationProps> = ({
  formData,
  availableCareers,
  onFormUpdate,
  onNext,
  onBack,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  const semesterOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}° Semestre`,
  }));

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
        {/* Mostrar carrera seleccionada */}
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Carrera seleccionada:
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {availableCareers.find((c) => c.id === formData.career)?.name ||
                  "No seleccionado"}
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-sm text-accent hover:text-accent/80 underline font-medium"
            >
              Cambiar
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Año de ingreso
              </label>
              <Select
                value={formData.startYear}
                onChange={(value) => onFormUpdate({ startYear: Number(value) })}
                options={yearOptions}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Semestre actual
              </label>
              <Select
                value={formData.semester}
                onChange={(value) => onFormUpdate({ semester: Number(value) })}
                options={semesterOptions}
                required
              />
            </div>
          </div>

          <div className="flex space-x-6 mt-10">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-8 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
            >
              <SvgIcon name="arrow-left" size="sm" />
              <span>Atrás</span>
            </button>
            <button
              onClick={onNext}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
            >
              <span>Continuar</span>
              <SvgIcon name="arrow-right" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicConfiguration;
