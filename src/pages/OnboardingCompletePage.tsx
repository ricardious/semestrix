/**
 * Onboarding Step 3: Complete
 *
 * Final step to complete onboarding
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteOnboarding } from "@services/profiles/mutations";
import GradientBackdrop from "@atoms/GradientBackdrop";
import GradientTitle from "@atoms/GradientTitle";
import Stepper from "@molecules/Stepper";
import SvgIcon from "@atoms/SvgIcon";
import { ONBOARDING_STEPS } from "@lib/constants/onboarding";

export default function OnboardingCompletePage() {
  const navigate = useNavigate();
  const completeOnboardingMutation = useCompleteOnboarding();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auto-complete onboarding when this page loads
    const complete = async () => {
      try {
        await completeOnboardingMutation.mutateAsync();
        // Wait a bit before redirecting
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
      } catch (err: any) {
        setError(err.message || "Error al completar el onboarding");
      }
    };

    complete();
  }, []);

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <GradientBackdrop />

        <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.6s_ease-in-out] text-center">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="mb-3 text-2xl font-bold text-error-content">Error</h1>
          <p className="mb-6 text-base-content/70">{error}</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="button-primary px-6 py-3 text-white transition-all duration-300"
          >
            ← Volver al Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <GradientBackdrop />

      <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.6s_ease-in-out] text-center">
        <Stepper steps={ONBOARDING_STEPS} currentStep={3} />
        <div className="mb-6 flex justify-center">
          {/* Success Animation */}
          <div className="relative h-24 w-24">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-base-100 p-6 shadow-md">
              <SvgIcon name="circle-check" className="h-14 w-14 text-success" />
            </div>
          </div>
        </div>

        <GradientTitle gradientText="¡Todo listo!" className="mb-4" />

        <p className="mb-8 text-base-content/70">
          Completando tu perfil y redirigiendo al dashboard...
        </p>

        <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-base-300/50 dark:bg-base-content/10">
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-primary via-secondary to-accent"></div>
        </div>
      </div>
    </div>
  );
}
