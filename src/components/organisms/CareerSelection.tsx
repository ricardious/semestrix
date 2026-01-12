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
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-xs sm:max-w-none mx-auto">
        {careers.map((career) => (
          <button
            key={career.id}
            onClick={() => onCareerSelect(career.id)}
            className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-all duration-300 text-left group hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 sm:hover:-translate-y-1 active:scale-95"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary group-hover:text-white transition-colors duration-300">
                  {career.code}
                </span>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 leading-tight">
                  {career.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Código: {career.code}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CareerSelection;
