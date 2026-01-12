import SvgIcon from "@atoms/SvgIcon";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 mb-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => onStepClick?.(step)}
              disabled={step > currentStep}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step <= currentStep
                  ? "bg-primary text-white shadow-lg cursor-pointer hover:opacity-80"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              } ${
                step === currentStep ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              {step < currentStep ? <SvgIcon name="check" size="sm" /> : step}
            </button>
            {step < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                  step < currentStep
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
