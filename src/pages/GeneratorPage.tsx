/**
 * Generator Page
 *
 * Page for generating optimal course schedules.
 * Coming soon - placeholder for schedule generation features.
 */
import DashboardLayout from "@components/templates/DashboardLayout";
import SvgIcon from "@atoms/SvgIcon";

export default function GeneratorPage() {
  return (
    <DashboardLayout
      title="Generador de Horarios"
      subtitle="Genera horarios optimizados automáticamente"
    >
      <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
          <SvgIcon
            name="sparkles"
            className="h-12 w-12 text-primary dark:text-secondary"
          />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-base-content dark:text-white">
          Próximamente
        </h2>

        <p className="mb-6 max-w-md text-base-content/60 dark:text-white/60">
          Estamos desarrollando un generador inteligente de horarios que te
          ayudará a crear el horario perfecto basado en tus preferencias y
          disponibilidad.
        </p>

        <div className="rounded-lg border border-base-content/10 bg-base-100 p-4 dark:border-white/10 dark:bg-base-dark/50">
          <p className="text-sm text-base-content/70 dark:text-white/70">
            <span className="font-semibold">Funcionalidades planeadas:</span>
          </p>
          <ul className="mt-2 space-y-1 text-left text-sm text-base-content/60 dark:text-white/60">
            <li>• Generación automática de horarios</li>
            <li>• Filtros por preferencias de tiempo</li>
            <li>• Optimización de días libres</li>
            <li>• Comparación de múltiples opciones</li>
            <li>• Consideración de prerequisitos</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
