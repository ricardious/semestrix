import { clsx } from "clsx";
import Input from "@atoms/Input";
import SvgIcon from "@atoms/SvgIcon";
import { CurriculumCourseNode } from "@lib/types/api";

type Status = "passed" | "failed" | "in_progress" | "withdrawn";

interface CourseRowProps {
  course: CurriculumCourseNode;
  status: Status | "pending"; // pending is visual only if not selected
  grade: number | null;
  onChange: (updates: {
    status: Status | "pending";
    grade: number | null;
  }) => void;
  allCoursesMap: Record<number, CurriculumCourseNode>;
  lockReason: string | null;
}

export default function CourseRow({
  course,
  status,
  grade,
  onChange,
  allCoursesMap,
  lockReason,
}: CourseRowProps) {
  const isDisabled = lockReason !== null && status === "pending";

  return (
    <div
      onClick={() => {
        if (isDisabled) return;
        onChange({
          status: status === "passed" ? "pending" : "passed",
          grade: grade,
        });
      }}
      className={clsx(
        "group flex cursor-pointer flex-col gap-2 rounded-lg border p-3 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center sm:gap-4",
        // Default state text
        "text-base-content dark:text-base-dark-content",
        // Disabled state
        isDisabled &&
          "cursor-not-allowed grayscale bg-base-200/30 dark:bg-base-dark/20",
        // Status based styles
        !isDisabled &&
          status === "pending" &&
          "border-base-content/10 bg-base-100 hover:border-primary/30 dark:bg-base-dark/40",
        status === "passed" &&
          "border-success/30 bg-success/5 hover:border-success/50 hover:bg-success/10 dark:bg-success/5",
        status === "failed" &&
          "border-error/30 bg-error/5 hover:border-error/50 hover:bg-error/10 dark:bg-error/5",
        status === "in_progress" &&
          "border-info/30 bg-info/5 hover:border-info/50 hover:bg-info/10 dark:bg-info/5",
        status === "withdrawn" &&
          "border-warning/30 bg-warning/5 hover:border-warning/50 hover:bg-warning/10 dark:bg-warning/5"
      )}
    >
      {/* Course Info */}
      <div className="flex flex-1 items-center gap-4">
        {/* Selection Indicator */}
        <div
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full border-1 transition-all duration-300",
            isDisabled
              ? "border-base-300 dark:border-base-100"
              : status === "passed"
              ? "border-success bg-success text-white scale-110 shadow-lg shadow-success/30"
              : "border-base-content/30 bg-base-100 group-hover:border-primary group-hover:scale-110 dark:bg-base-dark dark:border-base-content/40"
          )}
        >
          {status === "passed" && !isDisabled && (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
          {isDisabled && (
            <SvgIcon name="padlock-square-1" className="h-3.5 w-3.5" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-base-content/70 dark:text-base-dark-content/70">
              {course.course_code}
            </span>
            <h4
              className={clsx(
                "font-medium transition-colors",
                isDisabled
                  ? "text-base-content/50 dark:text-base-dark-content/50"
                  : status === "passed"
                  ? "text-success-content dark:text-success"
                  : "text-base-content dark:text-base-dark-content"
              )}
            >
              {course.course_name}
            </h4>
          </div>
          <span className="text-xs text-base-content/70 dark:text-base-dark-content/70">
            {course.credits} créditos {course.is_mandatory && "• Obligatoria"}
            {isDisabled && (
              <span className="text-error ml-2">• {lockReason}</span>
            )}
          </span>

          {/* Requirements Display */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {course.requirements.map((req, i) => {
                if (req.type === "credit") {
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center rounded bg-base-200 px-1 py-0.5 text-[10px] text-base-content/70 dark:text-base-dark-content/70 dark:bg-base-dark/50"
                      title={`Requiere ${req.value} créditos aprobados`}
                    >
                      <SvgIcon
                        name="flash-2"
                        className="mr-1 size-3 text-yellow-300"
                      />
                      {req.value} Cr.
                    </span>
                  );
                }

                // Course requirement
                const reqCourse = allCoursesMap[req.value];
                const label = reqCourse
                  ? reqCourse.course_code
                  : `ID:${req.value}`;
                const typeShort =
                  req.type === "prerequisite"
                    ? "Pre"
                    : req.type === "corequisite"
                    ? "Co"
                    : "Sim";

                return (
                  <span
                    key={i}
                    className="inline-flex items-center rounded bg-base-200 px-1 py-0.5 text-[10px] text-base-content/70 dark:text-base-dark-content/70 dark:bg-base-dark/50"
                    title={`${req.type}: ${
                      reqCourse?.course_name || "Desconocido"
                    }`}
                  >
                    {typeShort}: <span className="font-mono ml-1">{label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Grade Input (Only if passed) */}
        <div
          className={clsx(
            "w-28 transition-all duration-300 ease-out",
            status === "passed"
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-4 opacity-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            type="number"
            value={grade ?? ""}
            onChange={(e) =>
              onChange({
                status: "passed",
                grade: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="Nota"
            disabled={status !== "passed"}
            className="h-9 px-2 text-sm"
            min={61}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}
