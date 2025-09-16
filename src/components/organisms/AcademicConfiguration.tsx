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
  const yearOptions = Array.from({ length: 15 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  const graduationOptions = Array.from({ length: 8 }, (_, i) => ({
    value: currentYear + i,
    label: (currentYear + i).toString(),
  }));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Carrera seleccionada:
              </p>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {availableCareers.find((c) => c.id === formData.career)?.name ||
                  "No seleccionado"}
              </p>
            </div>
            <button
              onClick={onBack}
              className="self-start sm:self-auto text-xs sm:text-sm text-accent hover:text-accent/80 underline font-medium transition-colors"
            >
              Cambiar
            </button>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                ¿Cuándo planeas graduarte?
              </label>
              <Select
                value={formData.semester}
                onChange={(value) => onFormUpdate({ semester: Number(value) })}
                options={graduationOptions}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10">
            <button
              onClick={onBack}
              className="order-2 sm:order-1 flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-medium sm:font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base md:text-lg"
            >
              <SvgIcon name="arrow-left" size="sm" />
              <span>Atrás</span>
            </button>

            <button
              onClick={onNext}
              className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-medium sm:font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base md:text-lg"
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
