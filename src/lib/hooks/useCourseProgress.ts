import { useMemo } from "react";
// Remove unused useQuery import if not needed, or keep if you intend to use it later.
// Currently it's unused.
import { HistoryItem, CurriculumCourseNode } from "../types/api";
import { useCurriculumStructure } from "@services/programs/queries";
import { useMyHistory } from "@services/history/queries";

export type CourseStatus = "completed" | "available" | "locked" | "warning";

export interface CourseProgressNode extends CurriculumCourseNode {
  status: CourseStatus;
  historyItem?: HistoryItem;
  missingRequirements: string[]; // names of missing requirements
}

export interface SemesterProgress {
  semester: number;
  total_credits: number;
  approved_credits: number;
  courses: CourseProgressNode[];
}

export interface DashboardProgress {
  semesters: SemesterProgress[];
  extracurriculars: HistoryItem[];
  overallProgress: {
    totalCredits: number;
    approvedCredits: number;
    completedCount: number;
    totalCount: number;
  };
  isLoading: boolean;
  error: unknown;
}

export function useCourseProgress(versionId: number | null): DashboardProgress {
  // useCurriculumStructure has `enabled: !!versionId` baked into it via the query?
  // No, checking the implementation via read_file above:
  // export function useCurriculumStructure(versionId: number) { return useQuery({ ..., enabled: !!versionId, ... }); }
  // It only accepts versionId. The 'enabled' property is internal to the hook but the HOOK FUNCTION only takes one arg.
  // Wait, if versionId is null, I pass 0?
  const {
    data: structure,
    isLoading: isStructLoading,
    error: structError,
  } = useCurriculumStructure(versionId ?? 0);

  const {
    data: history,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useMyHistory();

  const progressData = useMemo(() => {
    if (!structure || !history) {
      return {
        semesters: [],
        extracurriculars: [],
        overallProgress: {
          totalCredits: 0,
          approvedCredits: 0,
          completedCount: 0,
          totalCount: 0,
        },
      };
    }

    // 1. Create Maps for Lookups
    const courseById = new Map<number, CurriculumCourseNode>();
    const courseNameById = new Map<number, string>();

    // Add known courses from structure
    structure.semesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        courseById.set(c.course_id, c);
        courseNameById.set(c.course_id, c.course_name);
      });
    });

    // 2. Process History & Credits
    const passedCourseIds = new Set<number>();
    const historyByCourseId = new Map<number, HistoryItem>();
    const extracurriculars: HistoryItem[] = [];
    let approvedCredits = 0;
    let completedCount = 0;

    // history is HistoryItem[] directly based on API service response check
    history.forEach((item) => {
      historyByCourseId.set(item.course_id, item);

      const inStructure = courseById.has(item.course_id);

      if (!inStructure) {
        extracurriculars.push(item);
      }

      if (
        ["passed", "approved", "aprobado"].includes(item.status.toLowerCase())
      ) {
        passedCourseIds.add(item.course_id);

        if (inStructure) {
          completedCount++;
          approvedCredits += courseById.get(item.course_id)!.credits;
        } else {
          // Extracurricular credits? Assuming 0 unless we had a way to know.
          // Usually only structure courses count for requirements based on credits.
        }
      }
    });

    // 3. Compute Status per Course
    const semesters: SemesterProgress[] = structure.semesters.map((sem) => {
      const semesterCourses: CourseProgressNode[] = sem.courses.map(
        (course) => {
          const historyItem = historyByCourseId.get(course.course_id);
          const isPassed = passedCourseIds.has(course.course_id);

          let status: CourseStatus = "locked";
          const missingRequirements: string[] = [];

          if (isPassed) {
            status = "completed";
          } else {
            // Check requirements
            let reqsMet = true;

            for (const req of course.requirements) {
              if (req.type === "prerequisite") {
                if (!passedCourseIds.has(req.value)) {
                  reqsMet = false;
                  const reqName =
                    courseNameById.get(req.value) || `Curso #${req.value}`;
                  missingRequirements.push(`Prerrequisito: ${reqName}`);
                }
              } else if (req.type === "credit") {
                if (approvedCredits < req.value) {
                  reqsMet = false;
                  missingRequirements.push(
                    `Créditos: Requiere ${req.value} (Tienes ${approvedCredits})`
                  );
                }
              } else if (req.type === "corequisite") {
                // Logic: If corequisite, we warn but don't strictly lock 'available' if UX prefers.
                // However, prompt implies "strict logic".
                // "cumple si required_course_id ∈ passedCourseIds"
                // "si NO está passed, dejarlo locked o warning (elige 1 criterio consistente)"
                // Let's use 'warning' if not passed, effectively allowing enrolment but warning.
                // But for simplicity of 'lock/unlock' metaphors, purely locking might be cleaner.
                // Let's strict lock for 'corequisite' if not passed, but wait...
                // Corequisites are usually taken TOGETHER. If I haven't passed it, I might be taking it NOW.
                // If I am NOT taking it now, then I am missing it.
                // For Dashboard visualization: "Available" means I CAN take it.
                // If it's a coreq, I CAN take it if I take the other one too.
                // Let's mark it 'available' but maybe add a note?
                // To follow prompt "si NO está passed, dejarlo locked o warning", I'll set warning if not passed.
                if (!passedCourseIds.has(req.value)) {
                  // It's not fully blocking, but it's a constraint.
                  const reqName =
                    courseNameById.get(req.value) || `Curso #${req.value}`;
                  missingRequirements.push(`Correquisito: ${reqName}`);
                  // We don't set reqsMet = false here to allow it to be 'available' but with warning logic potentially.
                  // Actually, let's treat it as a hard dependency for "status" calculation simplification,
                  // OR strictly follow: if not passed -> warning status.
                }
              }
            }

            if (reqsMet) {
              // Check if missing coreqs
              const hasMissingCoreqs = course.requirements.some(
                (r) => r.type === "corequisite" && !passedCourseIds.has(r.value)
              );
              if (hasMissingCoreqs) {
                status = "warning";
              } else {
                status = "available";
              }
            } else {
              status = "locked";
            }
          }

          return {
            ...course,
            status,
            historyItem,
            missingRequirements,
          };
        }
      );

      const semApprovedCredits = semesterCourses
        .filter((c) => c.status === "completed")
        .reduce((sum, c) => sum + c.credits, 0);

      return {
        semester: sem.semester,
        total_credits: sem.total_credits,
        approved_credits: semApprovedCredits,
        courses: semesterCourses,
      };
    });

    const totalStructureCredits = structure.semesters.reduce(
      (acc, s) => acc + s.total_credits,
      0
    );
    const totalStructureCount = structure.semesters.reduce(
      (acc, s) => acc + s.courses.length,
      0
    );

    return {
      semesters: semesters.sort((a, b) => a.semester - b.semester),
      extracurriculars,
      overallProgress: {
        totalCredits: totalStructureCredits,
        approvedCredits,
        completedCount,
        totalCount: totalStructureCount,
      },
    };
  }, [structure, history]);

  return {
    ...progressData,
    isLoading: isStructLoading || isHistoryLoading,
    error: structError || historyError,
  };
}
