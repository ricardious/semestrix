import { clsx } from "clsx";
import Badge, { BadgeVariant } from "@atoms/Badge";

export interface CourseItem {
  course_code: string;
  course_name: string;
  grade?: number | null;
  status: string;
}

interface CourseTableProps {
  items: CourseItem[];
  maxHeight?: string;
  className?: string;
  limit?: number;
}

export default function CourseTable({
  items,
  maxHeight = "max-h-96",
  className,
  limit,
}: CourseTableProps) {
  const displayedItems = limit ? items.slice(0, limit) : items;
  const remainingCount = limit ? Math.max(0, items.length - limit) : 0;

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "passed":
      case "approved":
        return "success";
      case "failed":
        return "error";
      case "in_progress":
      case "doing":
        return "info";
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "passed":
      case "approved":
        return "Aprobada";
      case "failed":
        return "Reprobada";
      case "in_progress":
        return "Cursando";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  return (
    <div
      className={clsx(
        "custom-scrollbar overflow-y-auto rounded-2xl border shadow-sm transition-colors",
        "border-base-content/10 bg-base-100",
        "dark:border-base-dark-content/10 dark:bg-base-dark",
        maxHeight,
        className
      )}
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-base-200/95 backdrop-blur-sm dark:bg-base-dark/95 w-full z-10">
          <tr className="border-b border-base-content/10 dark:border-base-dark-content/10">
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-base-content dark:text-base-dark-content">
              Código
            </th>
            <th className="px-4 py-3 text-left font-semibold text-base-content dark:text-base-dark-content">
              Materia
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-base-content dark:text-base-dark-content">
              Nota
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-base-content dark:text-base-dark-content">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-content/5 dark:divide-base-dark-content/5">
          {displayedItems.length > 0 ? (
            displayedItems.map((item, i) => (
              <tr
                key={`${item.course_code}-${i}`}
                className={clsx(
                  "group transition-colors",
                  "hover:bg-base-content/5 dark:hover:bg-base-dark-content/5"
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-base-content/70 dark:text-base-dark-content/70">
                  {item.course_code}
                </td>
                <td className="px-4 py-3 font-medium text-base-content dark:text-base-dark-content">
                  {item.course_name}
                </td>
                <td className="px-4 py-3 font-semibold text-base-content dark:text-base-dark-content">
                  {item.grade ?? (
                    <span className="font-normal text-base-content/40 dark:text-base-dark-content/40">
                      -
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    label={getStatusLabel(item.status)}
                    variant={getStatusVariant(item.status)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-base-content/50 dark:text-base-dark-content/50"
              >
                No hay materias para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {remainingCount > 0 && (
        <div className="border-t border-base-content/10 bg-base-200/30 px-4 py-3 text-center text-xs font-medium text-base-content/60 dark:border-base-dark-content/10 dark:bg-base-dark-content/5 dark:text-base-dark-content/60">
          ... y {remainingCount} materias más
        </div>
      )}
    </div>
  );
}
