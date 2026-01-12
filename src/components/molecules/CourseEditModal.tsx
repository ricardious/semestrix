/**
 * Course Edit Modal
 *
 * Modal for editing course history entries (grade, status, etc.)
 */
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";
import Input from "@atoms/Input";
import Select from "./Select";
import { HistoryItem, ManualUpdateRequest } from "@lib/types/api";
import { CurriculumCourseNode } from "@lib/types/api";

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CurriculumCourseNode | null;
  historyItem?: HistoryItem | null;
  onSave: (historyId: number | null, data: ManualUpdateRequest) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "passed", label: "Aprobado", color: "success" },
  { value: "failed", label: "Reprobado", color: "error" },
  { value: "in_progress", label: "Cursando", color: "info" },
  { value: "withdrawn", label: "Retirado", color: "neutral" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);
const TERMS = [
  { value: 1, label: "Primer Semestre" },
  { value: 2, label: "Segundo Semestre" },
  { value: 3, label: "Verano" },
];

export default function CourseEditModal({
  isOpen,
  onClose,
  course,
  historyItem,
  onSave,
  isLoading = false,
}: CourseEditModalProps) {
  const [grade, setGrade] = useState<string>("");
  const [status, setStatus] = useState<string>("passed");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [term, setTerm] = useState<number>(1);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && course) {
      if (historyItem) {
        setGrade(historyItem.grade?.toString() || "");
        // Validate incoming status; if missing or unknown, default to 'passed'
        setStatus(
          historyItem.status &&
            ["passed", "failed", "in_progress", "withdrawn"].includes(
              historyItem.status
            )
            ? historyItem.status
            : "passed"
        );
        setYear(historyItem.year || CURRENT_YEAR);
        setTerm(historyItem.term || 1);
      } else {
        setGrade("");
        setStatus("passed");
        setYear(CURRENT_YEAR);
        setTerm(1);
      }
    }
  }, [isOpen, course, historyItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gradeNum = grade !== "" ? parseFloat(grade) : null;

    const data: ManualUpdateRequest = {
      course_id: course?.course_id,
      year,
      term,
      grade: gradeNum,
      status,
    };

    onSave(historyItem?.history_id || null, data);
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl border border-base-content/10 bg-base-100 p-6 shadow-2xl dark:border-white/10 dark:bg-base-dark/70">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-base-content/50 dark:text-white/50">
                {course.course_code}
              </span>
              <h2 className="text-lg font-bold text-base-content dark:text-white">
                {course.course_name}
              </h2>
              <p className="text-xs text-base-content/60 dark:text-white/60">
                {course.credits} créditos
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-base-content/50 transition-colors hover:bg-base-200 hover:text-base-content dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <SvgIcon name="cancel" className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Year & Term Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-base-content/70 dark:text-white/70">
                  Año
                </label>
                <Select
                  options={YEARS}
                  value={year}
                  onChange={setYear}
                  getLabel={(y) => String(y)}
                  getValue={(y) => y}
                  placeholder="Año"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-base-content/70 dark:text-white/70">
                  Período
                </label>
                <Select
                  options={TERMS}
                  value={TERMS.find((t) => t.value === term) || null}
                  onChange={(t) => setTerm(t.value)}
                  getLabel={(t) => t.label}
                  getValue={(t) => t.value}
                  placeholder="Período"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-base-content/70 dark:text-white/70">
                Estado
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      status === opt.value
                        ? opt.color === "success"
                          ? "border-success bg-success/20 text-success"
                          : opt.color === "error"
                          ? "border-error bg-error/20 text-error"
                          : opt.color === "info"
                          ? "border-info bg-info/20 text-info"
                          : "border-base-content/30 bg-base-content/10 text-base-content dark:border-white/30 dark:bg-white/10 dark:text-white"
                        : "border-base-content/10 text-base-content/60 hover:border-base-content/20 hover:bg-base-200/50 dark:border-white/10 dark:text-white/60 dark:hover:border-white/20 dark:hover:bg-white/5"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-base-content/70 dark:text-white/70">
                Nota (0-100)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step={1}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Ej: 75"
              />
              <p className="mt-1 text-[10px] text-base-content/50 dark:text-white/50">
                Deja vacío si no tienes nota aún
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-base-content/10 px-4 py-2.5 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200/50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
