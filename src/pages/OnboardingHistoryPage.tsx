/**
 * Onboarding Step 2: History Import
 *
 * User can import history by pasting text or add manually
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMarkHistoryDone } from "@services/profiles/mutations";
import {
  usePreviewHistoryImport,
  useCommitHistoryImport,
} from "@services/history/mutations";
import { ImportPreviewResponse } from "@lib/types/api";
import { ONBOARDING_STEPS } from "@lib/constants/onboarding";
import Stepper from "@molecules/Stepper";
import GradientBackdrop from "@atoms/GradientBackdrop";
import RichTextEditor from "@molecules/RichTextEditor";
import CourseTable from "@molecules/CourseTable";
import ManualHistoryEditor from "@organisms/ManualHistoryEditor";
import { useMyProfile } from "@services/profiles/queries";
import GradientTitle from "@atoms/GradientTitle";
import ActionCard from "@molecules/ActionCard";
import StatsCard from "@molecules/StatsCard";

// Wrapper to safely load profile data
function ProfileLoaderWrapper({
  children,
}: {
  children: (profile: any) => React.ReactNode;
}) {
  const { data: profile, isLoading } = useMyProfile();
  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  if (!profile)
    return <div className="p-4 text-error">No se pudo cargar el perfil</div>;
  return <>{children(profile)}</>;
}

export default function OnboardingHistoryPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choice" | "import" | "manual" | "preview">(
    "choice"
  );
  const [historyText, setHistoryText] = useState("");
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewMutation = usePreviewHistoryImport();
  const commitImportMutation = useCommitHistoryImport();
  const markHistoryDoneMutation = useMarkHistoryDone();

  const handlePreview = async () => {
    setError(null);
    try {
      const result = await previewMutation.mutateAsync({
        raw_text: historyText,
      });
      setPreview(result);
      setMode("preview");
    } catch (err: any) {
      setError(err.message || "Error al procesar el historial");
    }
  };

  const handleCommit = async () => {
    if (!preview) return;

    setError(null);
    try {
      await commitImportMutation.mutateAsync({
        items: preview.items,
      });

      // Mark history as done
      await markHistoryDoneMutation.mutateAsync();

      // Navigate to completion
      navigate("/onboarding/complete");
    } catch (err: any) {
      setError(err.message || "Error al guardar el historial");
    }
  };

  const handleSkip = async () => {
    try {
      await markHistoryDoneMutation.mutateAsync();
      navigate("/onboarding/complete");
    } catch (err: any) {
      setError("Error al omitir el paso. Intenta de nuevo.");
    }
  };

  // Choice screen
  if (mode === "choice") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <GradientBackdrop />

        <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.6s_ease-in-out]">
          <Stepper steps={ONBOARDING_STEPS} currentStep={2} />
          <div className="mb-8 text-center">
            <GradientTitle
              gradientText="Tu Historial"
              postText="Académico"
              className="mb-3"
            />
            <p className="text-base-content/70 dark:text-base-dark-content/70">
              ¿Cómo deseas agregar tus materias cursadas?
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ActionCard
              title="Importar desde texto"
              description="Pega tu historial del sistema y lo procesamos automáticamente."
              icon="cloud-upload"
              onClick={() => setMode("import")}
              variant="primary"
            />

            <ActionCard
              title="Ingreso manual"
              description="Agrega tus materias una por una manualmente."
              icon="edit"
              onClick={() => setMode("manual")}
              variant="dashed"
            />
          </div>

          {error && (
            <div className="mt-4 animate-[fadeIn_0.3s_ease-in-out] rounded-lg border border-error/20 bg-error/10 p-4">
              <p className="text-sm text-error-content">{error}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              to="/onboarding"
              className="rounded-lg border border-base-300 px-6 py-3 transition-all duration-200 hover:bg-base-100/50 dark:border-base-content/10"
            >
              ← Volver al paso anterior
            </Link>

            <button
              onClick={handleSkip}
              className="text-sm font-medium text-base-content/60 dark:text-base-dark-content/60 hover:text-primary transition-colors"
            >
              Omitir este paso
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Import mode
  if (mode === "import") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <GradientBackdrop />
        <div className="relative z-10 w-full max-w-2xl animate-[fadeIn_0.6s_ease-in-out]">
          <Stepper steps={ONBOARDING_STEPS} currentStep={2} />
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-base-content dark:text-base-dark-content">
              Importar Historial
            </h1>
            <p className="text-base-content/70 dark:text-base-dark-content/70">
              Pega el texto de tu historial académico
            </p>
          </div>

          <RichTextEditor
            label="Historial Académico (Texto plano)"
            value={historyText}
            onChange={setHistoryText}
            placeholder={`Código	Nombre	Creditos	Fecha de Aprobado	Nota	Observaciones
0061	CONGRESOS ESTUDIANTILES	2	2024-11	Aprobado	
0348	LENGUAJES FORMALES	5	2024-6	85.00	`}
            rows={16}
            className="w-full shadow-sm"
          />

          {error && (
            <div className="mt-4 animate-[fadeIn_0.3s_ease-in-out] rounded-lg border border-error/20 bg-error/10 p-4">
              <p className="text-sm text-error-content">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setMode("choice")}
              className="rounded-lg border border-base-300 px-6 py-3 transition-all duration-200 hover:bg-base-100/50 dark:border-base-content/10"
            >
              ← Volver
            </button>
            <button
              onClick={handlePreview}
              disabled={!historyText || previewMutation.isPending}
              className="button-primary flex-1 px-6 py-3 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {previewMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  Procesando...
                </span>
              ) : (
                "Vista Previa →"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview mode
  if (mode === "preview" && preview) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <GradientBackdrop />

        <div className="relative z-10 w-full max-w-3xl animate-[fadeIn_0.6s_ease-in-out]">
          <Stepper steps={ONBOARDING_STEPS} currentStep={2} />
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-base-content dark:text-base-dark-content">
              Confirmar Importación
            </h1>
            <p className="text-base-content/70 dark:text-base-dark-content/70">
              Se encontraron {preview.rows_parsed} materias
            </p>
          </div>

          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatsCard
              label="Materias"
              value={preview.rows_parsed}
              icon="write-book"
              variant="primary"
            />
            <StatsCard
              label="Promedio"
              value={preview.avg_grade?.toFixed(2) || "—"}
              icon="graph-bar-increase"
              variant="secondary"
            />
            <StatsCard
              label="Aprobadas"
              value={
                preview.items.filter((i) =>
                  ["approved", "passed", "aprobado"].includes(
                    i.status.toLowerCase()
                  )
                ).length
              }
              icon="circle-check"
              variant="success"
            />
            <StatsCard
              label="En Curso/Pend"
              value={
                preview.items.filter(
                  (i) =>
                    ![
                      "approved",
                      "passed",
                      "aprobado",
                      "failed",
                      "reprobado",
                    ].includes(i.status.toLowerCase())
                ).length
              }
              icon="star"
              variant="warning"
            />
          </div>

          {/* Warnings */}
          {preview.errors.length > 0 && (
            <div className="mb-6 animate-[fadeIn_0.3s_ease-in-out] rounded-xl border border-warning/20 bg-warning/10 p-4">
              <div className="font-semibold text-warning-content">
                ⚠️ Advertencias:
              </div>
              <ul className="mt-2 space-y-1 text-sm text-warning-content/80">
                {preview.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Courses list */}
          <CourseTable items={preview.items} limit={50} />

          {error && (
            <div className="mt-4 animate-[fadeIn_0.3s_ease-in-out] rounded-lg border border-error/20 bg-error/10 p-4">
              <p className="text-sm text-error-content">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setMode("import")}
              className="rounded-lg border border-base-300 px-6 py-3 transition-all duration-200 hover:bg-base-100/50 dark:border-base-content/10"
            >
              ← Editar
            </button>
            <button
              onClick={handleCommit}
              disabled={commitImportMutation.isPending}
              className="button-primary flex-1 px-6 py-3 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commitImportMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  Guardando...
                </span>
              ) : (
                "Confirmar Importación ✓"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Manual mode
  if (mode === "manual") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <GradientBackdrop />

        <div className="relative z-10 w-full max-w-4xl animate-[fadeIn_0.6s_ease-in-out]">
          <Stepper steps={ONBOARDING_STEPS} currentStep={2} />

          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-base-content dark:text-base-dark-content">
              Mapa del Pensum
            </h1>
            <p className="text-base-content/70 dark:text-base-dark-content/70">
              Marca las materias que ya has aprobado.
            </p>
          </div>

          <div className="rounded-2xl border border-base-content/5 p-6 backdrop-blur-xl shadow-xl">
            <ProfileLoaderWrapper>
              {(profile) => (
                <ManualHistoryEditor
                  versionId={Number(profile.current_version_id || 1)}
                  onComplete={() => navigate("/onboarding/complete")}
                  onCancel={() => setMode("choice")}
                />
              )}
            </ProfileLoaderWrapper>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
