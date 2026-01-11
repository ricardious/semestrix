import { clsx } from "clsx";
import Badge from "@atoms/Badge";
import SvgIcon from "@atoms/SvgIcon";
import { CourseStatus } from "@lib/hooks/useCourseProgress";
import { CurriculumCourseNode, HistoryItem } from "@lib/types/api";

interface CourseCardProps {
  course: CurriculumCourseNode;
  status: CourseStatus;
  historyItem?: HistoryItem;
  missingRequirements?: string[];
  onClick?: () => void;
  compact?: boolean; // For mobile/dense view
}

export default function CourseCard({
  course,
  status,
  historyItem,
  missingRequirements = [],
  onClick,
  compact = false,
}: CourseCardProps) {
  // Styles based on status
  const cardStyles = {
    completed:
      "border-success/20 bg-success/5 dark:bg-success/10 hover:border-success/40",
    available:
      "border-primary/20 bg-base-100 dark:bg-base-dark hover:border-primary/40 hover:shadow-md",
    warning:
      "border-warning/30 bg-warning/5 dark:bg-warning/10 hover:border-warning/50",
    locked:
      "border-base-200 dark:border-white/5 bg-base-200/50 dark:bg-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 transition-opacity", // Locked is dim
  };

  const statusLabels: Record<CourseStatus, string> = {
    completed: "Aprobada",
    available: "Disponible",
    warning: "Con Pendientes",
    locked: "Bloqueada",
  };

  const statusColors: Record<
    CourseStatus,
    "success" | "info" | "warning" | "error" | "neutral"
  > = {
    completed: "success",
    available: "info",
    warning: "warning",
    locked: "neutral",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all duration-200",
        cardStyles[status],
        compact ? "h-24" : "min-h-[7rem]"
      )}
    >
      {/* Header: Code & Credits */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs font-bold text-base-content/60 dark:text-base-dark-content/60">
          {course.course_code}
        </span>
        <span className="text-xs font-medium text-base-content/50 dark:text-base-dark-content/50">
          {course.credits} CR
        </span>
      </div>

      {/* Body: Name */}
      <h3
        className={clsx(
          "font-semibold text-base-content dark:text-base-dark-content line-clamp-2",
          compact ? "text-sm my-1" : "text-sm my-2"
        )}
      >
        {course.course_name}
      </h3>

      {/* Footer: Status Badge or Grade */}
      <div className="flex items-end justify-between mt-auto">
        {status === "completed" &&
        historyItem?.grade !== null &&
        historyItem?.grade !== undefined ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-base-content/40 font-bold">
              Nota
            </span>
            <span className="font-bold text-lg text-success">
              {historyItem.grade.toFixed(0)}
            </span>
          </div>
        ) : (
          !compact && (
            <Badge
              label={statusLabels[status]}
              variant={statusColors[status] as any}
              size="sm"
              className="text-[10px]"
            />
          )
        )}

        {/* Lock Icon / Requirements Tooltip placeholder */}
        {status === "locked" && (
          <div className="group relative">
            <SvgIcon
              name="padlock-square-1"
              className="text-lg text-base-content/50 dark:text-base-dark-content/50"
            />
            {/* Tooltip */}
            {missingRequirements.length > 0 && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded bg-base-300 p-2 text-[10px] text-base-content shadow-xl z-50 invisible group-hover:visible">
                <p className="font-bold mb-1">Requisitos faltantes:</p>
                <ul className="list-disc pl-3 space-y-0.5">
                  {missingRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Warning Icon for Coreqs */}
        {status === "warning" && (
          <div title={missingRequirements.join(", ")}>
            <SvgIcon name="circle-help" className="text-lg text-warning" />
          </div>
        )}
      </div>

      {/* Grade for compact completed without grade visible above due to space? No, grade is priority */}
    </div>
  );
}
