import { motion } from "framer-motion";
import { clsx } from "clsx";

interface OnboardingStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: "Identidad" },
  { number: 2, label: "Historial" },
  { number: 3, label: "Finalizar" },
];

export default function OnboardingStepper({
  currentStep,
}: OnboardingStepperProps) {
  return (
    <div className="mb-10 flex w-full flex-col items-center px-4">
      <div className="flex items-center gap-3">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <motion.div
              key={step.number}
              layout
              className={clsx(
                "h-2.5 rounded-full transition-colors duration-300",
                isActive
                  ? "bg-primary"
                  : isCompleted
                  ? "bg-primary/40 cursor-pointer hover:bg-primary/60"
                  : "bg-base-300 dark:bg-base-content/10"
              )}
              initial={false}
              animate={{
                width: isActive ? 64 : 10, // Line (w-16) vs Dot (w-2.5)
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          );
        })}
      </div>

      {/* Active Step Label */}
      <div className="mt-4 text-center">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-base-content/70"
        >
          Paso {currentStep} de {steps.length}:{" "}
          <span className="font-bold text-primary">
            {steps[currentStep - 1].label}
          </span>
        </motion.p>
      </div>
    </div>
  );
}
