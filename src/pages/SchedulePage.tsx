/**
 * Schedule Page
 *
 * Page for viewing and managing student schedules.
 * Coming soon - placeholder for schedule management features.
 */
import DashboardLayout from "@components/templates/DashboardLayout";
import SvgIcon from "@atoms/SvgIcon";

export default function SchedulePage() {
  return (
    <DashboardLayout
      title="Mis Horarios"
      subtitle="Gestiona tus horarios de clases"
    >
      <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-info/20 to-accent/20">
          <SvgIcon
            name="calendar-check"
            className="h-12 w-12 text-info dark:text-accent"
          />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-base-content dark:text-white">
          Próximamente
        </h2>

        <p className="mb-6 max-w-md text-base-content/60 dark:text-white/60">
          Estamos trabajando en esta funcionalidad. Pronto podrás visualizar y
          gestionar tus horarios de clases de forma interactiva.
        </p>

        <div className="rounded-lg border border-base-content/10 bg-base-100 p-4 dark:border-white/10 dark:bg-base-dark/50">
          <p className="text-sm text-base-content/70 dark:text-white/70">
            <span className="font-semibold">Funcionalidades planeadas:</span>
          </p>
          <ul className="mt-2 space-y-1 text-left text-sm text-base-content/60 dark:text-white/60">
            <li>• Vista de horario semanal</li>
            <li>• Gestión de múltiples horarios</li>
            <li>• Detección de conflictos</li>
            <li>• Exportar a calendario</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
