/**
 * Onboarding Step 1: Identity
 *
 * User selects their program and enters student ID
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePrograms } from "@services/programs/queries";
import { useCreateIdentity } from "@services/profiles/mutations";
import { useMyProfile } from "@services/profiles/queries";
import GradientBackdrop from "@atoms/GradientBackdrop";
import GradientTitle from "@atoms/GradientTitle";
import Stepper from "@molecules/Stepper";
import SearchableSelect from "@molecules/SearchableSelect";
import Input from "@atoms/Input";
import { ONBOARDING_STEPS } from "@lib/constants/onboarding";
import type { Program } from "@lib/types/api";

export default function OnboardingIdentityPage() {
  const navigate = useNavigate();
  const { data: programs, isLoading: loadingPrograms } = usePrograms();
  const { data: profile } = useMyProfile();
  const createIdentityMutation = useCreateIdentity();

  const [studentId, setStudentId] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill data if returning to this step (and profile already exists)
  useEffect(() => {
    if (profile && programs) {
      if (profile.student_id && !studentId) {
        setStudentId(profile.student_id);
      }
      if (profile.current_program_id && !selectedProgram) {
        const prog = programs.find(
          (p) => p.program_id === profile.current_program_id
        );
        if (prog) setSelectedProgram(prog);
      }
    }
  }, [profile, programs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate student ID (9 digits)
    if (!/^\d{9}$/.test(studentId)) {
      setError("El carnet debe tener exactamente 9 dígitos");
      return;
    }

    if (!selectedProgram) {
      setError("Por favor selecciona tu carrera");
      return;
    }

    try {
      await createIdentityMutation.mutateAsync({
        student_id: studentId,
        program_id: selectedProgram.program_id,
      });

      // Navigate to next step
      navigate("/onboarding/history");
    } catch (err: any) {
      setError(err.message || "Error al guardar tu información");
    }
  };

  if (loadingPrograms) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <GradientBackdrop />
        <div className="relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          </div>
          <p className="text-lg text-base-content/70">Cargando carreras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-base-100 dark:bg-base-dark">
      {/* Background with overflow hidden */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <GradientBackdrop />
      </div>

      {/* Scrollable content container */}
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-y-auto p-4 md:p-8">
        <div className="w-full max-w-md animate-[fadeIn_0.6s_ease-in-out]">
          <Stepper steps={ONBOARDING_STEPS} currentStep={1} />
          <div className="mb-6 md:mb-8 text-center">
            <GradientTitle
              preText="Bienvenido a"
              gradientText="Semestrix"
              className="mb-3"
            />
            <p className="text-sm md:text-base text-base-content/70">
              Comencemos configurando tu perfil académico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Student ID */}
            <div className="space-y-2">
              <label
                htmlFor="student-id"
                className="block text-sm font-medium text-base-content dark:text-base-dark-content"
              >
                Carnet (9 dígitos)
              </label>
              <Input
                id="student-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="202300476"
                maxLength={9}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </div>

            {/* Program Selection */}
            <div className="space-y-2">
              <label
                htmlFor="program"
                className="block text-sm font-medium text-base-content dark:text-base-dark-content"
              >
                Carrera
              </label>
              <SearchableSelect
                options={programs || []}
                value={selectedProgram}
                onChange={setSelectedProgram}
                getLabel={(p) => p.program_name}
                getValue={(p) => p.program_id}
                placeholder="Busca tu carrera (ej. Ingeniería...)"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="animate-[fadeIn_0.3s_ease-in-out] rounded-lg border border-error/20 bg-error/10 p-4">
                <p className="text-sm text-error-content">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={createIdentityMutation.isPending}
                className="button-primary w-full px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createIdentityMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Guardando...
                  </span>
                ) : (
                  "Continuar →"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
