import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@atoms/SvgIcon";
import CourseRow from "./CourseRow";
import { CurriculumSemester, CurriculumCourseNode } from "@lib/types/api";

type Status = "passed" | "failed" | "in_progress" | "withdrawn";

interface SemesterSectionProps {
  semester: CurriculumSemester;
  courseStates: Record<
    string,
    { status: Status | "pending"; grade: number | null }
  >;
  onCourseChange: (
    courseCode: string,
    updates: { status: Status | "pending"; grade: number | null }
  ) => void;
  allCoursesMap: Record<number, CurriculumCourseNode>;
  getLockReason: (course: CurriculumCourseNode) => string | null;
}

export default function SemesterSection({
  semester,
  courseStates,
  onCourseChange,
  allCoursesMap,
  getLockReason,
}: SemesterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate which courses are currently toggleable/actionable
  const canToggleCourse = (course: CurriculumCourseNode) => {
    const isPassed = courseStates[course.course_code]?.status === "passed";
    // Can always toggle off if passed. Can toggle on only if not locked.
    return isPassed || !getLockReason(course);
  };

  const toggleableCourses = semester.courses.filter(canToggleCourse);
  const areAllToggleablePassed =
    toggleableCourses.length > 0 &&
    toggleableCourses.every(
      (c) => courseStates[c.course_code]?.status === "passed"
    );

  // Calculate progress for badge (keeping old variable names for display)
  const totalCourses = semester.courses.length;
  const passedCourses = semester.courses.filter(
    (c) => courseStates[c.course_code]?.status === "passed"
  ).length;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border-2 border-base-content/50 bg-base-100/50 shadow-sm transition-all dark:border-primary/50 dark:bg-base-dark/30">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-base-200/50 px-5 py-4 transition-colors hover:bg-base-200/80 dark:bg-base-dark/50 dark:hover:bg-base-dark-content/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            {semester.semester === 0 ? "U" : semester.semester}
          </div>
          <h3 className="font-bold text-base-content dark:text-base-dark-content">
            {semester.semester === 0
              ? "Cursos Universales"
              : `Semestre ${semester.semester}`}
          </h3>
          <span className="text-xs font-normal text-base-content/70 dark:text-base-dark-content/70">
            ({semester.total_credits} créditos)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (areAllToggleablePassed) {
                // Deselect all (even locked ones if they were passed essentially)
                semester.courses.forEach((course) => {
                  onCourseChange(course.course_code, {
                    status: "pending",
                    grade: null,
                  });
                });
              } else {
                // Select all toggleable (unlocked)
                semester.courses.forEach((course) => {
                  if (canToggleCourse(course)) {
                    onCourseChange(course.course_code, {
                      status: "passed",
                      grade: null,
                    });
                  }
                });
              }
            }}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {areAllToggleablePassed ? "Deseleccionar todo" : "Seleccionar todo"}
          </button>

          <div className="text-xs font-medium text-base-content/70 dark:text-base-dark-content/70">
            {passedCourses}/{totalCourses} Aprobados
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <SvgIcon
              name="chevron-down"
              className="h-5 w-5 text-base-content/50 dark:text-base-dark-content/50"
            />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-3 p-4">
              {semester.courses.map((course) => (
                <CourseRow
                  key={course.course_code}
                  course={course}
                  status={courseStates[course.course_code]?.status ?? "pending"}
                  grade={courseStates[course.course_code]?.grade ?? null}
                  onChange={(updates) =>
                    onCourseChange(course.course_code, updates)
                  }
                  allCoursesMap={allCoursesMap}
                  lockReason={getLockReason(course)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
