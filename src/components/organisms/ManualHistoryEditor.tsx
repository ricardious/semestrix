import { useState, useMemo } from "react";
import { useCurriculumStructure } from "@services/programs/queries";
import { useBulkUpsertHistory } from "@services/history/mutations";
import { useMarkHistoryDone } from "@services/profiles/mutations";
import { HistoryBulkItem, CurriculumCourseNode } from "@lib/types/api";
import SemesterSection from "@molecules/SemesterSection";
import LoadingSpinner from "@atoms/LoadingSpinner";

interface ManualHistoryEditorProps {
  versionId: number;
  onComplete: () => void;
  onCancel: () => void;
}

type Status = "passed" | "failed" | "in_progress" | "withdrawn";

export default function ManualHistoryEditor({
  versionId,
  onComplete,
  onCancel,
}: ManualHistoryEditorProps) {
  const {
    data: structure,
    isLoading,
    error,
  } = useCurriculumStructure(versionId);
  const bulkMutation = useBulkUpsertHistory();
  const markDoneMutation = useMarkHistoryDone();

  // Create a map of all courses for requirement resolution
  const { allCoursesMap, courseByCode } = useMemo(() => {
    if (!structure) return { allCoursesMap: {}, courseByCode: {} };
    const byId: Record<number, CurriculumCourseNode> = {};
    const byCode: Record<string, CurriculumCourseNode> = {};

    structure.semesters.forEach((sem) => {
      sem.courses.forEach((course) => {
        // Map by global course_id because requirements.value uses global course_id
        byId[course.course_id] = course;
        byCode[course.course_code] = course;
      });
    });
    return { allCoursesMap: byId, courseByCode: byCode };
  }, [structure]);

  // Local state for all course changes
  // Map: course_code -> { status, grade }
  const [courseStates, setCourseStates] = useState<
    Record<string, { status: Status | "pending"; grade: number | null }>
  >({});

  // Calculate stats for requirements verification
  const { totalCredits, passedIds } = useMemo(() => {
    const ids = new Set<number>();
    let credits = 0;

    // We only count "passed" courses for credits and prerequisites in history mode
    Object.entries(courseStates).forEach(([code, state]) => {
      if (state.status === "passed") {
        const node = courseByCode[code];
        if (node) {
          ids.add(node.course_id);
          credits += node.credits;
        }
      }
    });

    return { totalCredits: credits, passedIds: ids };
  }, [courseStates, courseByCode]);

  // Check if a course is locked (requirements not met)
  const getLockReason = (course: CurriculumCourseNode): string | null => {
    if (!course.requirements || course.requirements.length === 0) return null;

    for (const req of course.requirements) {
      if (req.type === "credit") {
        if (totalCredits < req.value) {
          return `Requiere ${req.value} créditos (Tienes ${totalCredits})`;
        }
      } else if (req.type === "prerequisite") {
        if (!passedIds.has(req.value)) {
          const reqCourse = allCoursesMap[req.value];
          return `Prerrequisito: ${
            reqCourse?.course_code || "Curso"
          } pendiente`;
        }
      }
      // Corequisites usually imply taking together or passed, but for history input/onboarding
      // we usually just enforce strict prerequisites chain to keep it simple.
      // If needed, check coreqs here too.
    }
    return null;
  };

  // Initialize state when structure loads (optional, if we successfully fetch EXISTING history later)
  // For now, start empty/pending.

  const handleCourseChange = (
    courseCode: string,
    updates: { status: Status | "pending"; grade: number | null }
  ) => {
    setCourseStates((prev) => {
      // If pending is selected, remove from state/set to pending
      if (updates.status === "pending") {
        const newStates = { ...prev };
        delete newStates[courseCode];
        return newStates;
      }

      return {
        ...prev,
        [courseCode]: { ...prev[courseCode], ...updates },
      };
    });
  };

  const handleSave = async () => {
    // Filter only modified items (not "pending" unless strictly needed, but let's assume we save anything changed from default)
    // Actually, save anything that is NOT "pending".
    const itemsToSave: HistoryBulkItem[] = Object.entries(courseStates)
      .filter(([_, state]) => state.status !== "pending")
      .map(([code, state]) => ({
        course_code: code,
        grade: state.grade,
        status: state.status as HistoryBulkItem["status"],
      }));

    if (itemsToSave.length === 0) {
      // Nothing to save, maybe just mark as done?
      try {
        await markDoneMutation.mutateAsync();
        onComplete();
      } catch (e) {}
      return;
    }

    try {
      await bulkMutation.mutateAsync({ items: itemsToSave });
      await markDoneMutation.mutateAsync();
      onComplete();
    } catch (err: any) {
      console.error("Failed to save history:", err);
      // Toast or error display handled by page or generic handler
    }
  };

  if (error)
    return (
      <div className="p-4 text-error">
        Error al cargar el pensum. Intenta recargar.
      </div>
    );

  if (isLoading || !structure)
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="w-full">
      {/* Map */}
      <div className="space-y-2">
        {structure.semesters
          .sort((a, b) => a.semester - b.semester)
          .map((sem) => (
            <SemesterSection
              key={sem.semester}
              semester={sem}
              courseStates={courseStates}
              onCourseChange={handleCourseChange}
              allCoursesMap={allCoursesMap}
              getLockReason={getLockReason}
            />
          ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onCancel}
          className="rounded-lg border border-base-300 px-6 py-3 transition-all duration-200 hover:bg-base-100/50 dark:border-base-content/10"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={bulkMutation.isPending}
          className="button-primary flex-1 px-6 py-3 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bulkMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Guardando...
            </span>
          ) : (
            `Guardar (${
              Object.values(courseStates).filter((s) => s.status !== "pending")
                .length
            } cambios)`
          )}
        </button>
      </div>
    </div>
  );
}
