import { useState } from "react";
import { clsx } from "clsx";
import CourseCard from "@molecules/CourseCard";
import {
  SemesterProgress,
  CourseStatus,
  CourseProgressNode,
} from "@lib/hooks/useCourseProgress";

interface DashboardCurriculumBoardProps {
  semesters: SemesterProgress[];
  onCourseClick?: (course: CourseProgressNode) => void;
}

export default function DashboardCurriculumBoard({
  semesters,
  onCourseClick,
}: DashboardCurriculumBoardProps) {
  // We can trust Tailwind's responsive classes for layout switching.
  // Desktop: Horizontal scroll of columns (Kanban style) or Grid. Use Grid for standard dashboard.
  // Mobile: Stacked Accordions.

  return (
    <div className="w-full">
      {/* 
        DESKTOP VIEW (md+) 
        Responsive Grid Layout: Wraps based on screen size (2 cols on MD, 3 on LG/XL)
      */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-6 px-1">
        {semesters.map((sem) => (
          <div
            key={sem.semester}
            className="w-full rounded-2xl bg-base-100/50 dark:bg-base-dark/30 p-4 border border-base-content/5 dark:border-white/5 flex flex-col gap-3 h-fit transition-all hover:bg-base-100/80 dark:hover:bg-base-dark/50"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-base-content/10 dark:border-white/10 pb-2 mb-2">
              <h3 className="font-bold text-base-content dark:text-base-dark-content">
                Semestre {sem.semester}
              </h3>
              <div className="text-xs text-base-content/60 dark:text-base-dark-content/60">
                <span className="font-semibold">{sem.approved_credits}</span> /{" "}
                {sem.total_credits} CR
              </div>
            </div>

            {/* Courses List */}
            <div className="flex flex-col gap-3">
              {sem.courses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  status={course.status as CourseStatus}
                  historyItem={course.historyItem}
                  missingRequirements={course.missingRequirements}
                  onClick={() => onCourseClick?.(course)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 
        MOBILE VIEW (< md)
        Accordion style (using daisyUI collapse or standard state)
      */}
      <div className="flex flex-col gap-3 md:hidden">
        {semesters.map((sem) => (
          <MobileSemesterAccordion
            key={sem.semester}
            semester={sem}
            onCourseClick={onCourseClick}
          />
        ))}
      </div>
    </div>
  );
}

function MobileSemesterAccordion({
  semester,
  onCourseClick,
}: {
  semester: SemesterProgress;
  onCourseClick?: (course: CourseProgressNode) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate completion percentage for progress bar
  const progress =
    semester.total_credits > 0
      ? (semester.approved_credits / semester.total_credits) * 100
      : 0;

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-content/10 shadow-sm rounded-xl">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="collapse-title flex flex-col gap-1 py-3 px-4">
        <div className="flex justify-between items-center w-full pr-2">
          <span className="font-bold text-base">
            Semestre {semester.semester}
          </span>
          <span className="text-xs font-mono opacity-60">
            {semester.approved_credits}/{semester.total_credits} CR
          </span>
        </div>

        {/* Progress Bar inside header */}
        <progress
          className={clsx(
            "progress w-full h-1.5",
            progress === 100 ? "progress-success" : "progress-primary"
          )}
          value={semester.approved_credits}
          max={semester.total_credits}
        ></progress>
      </div>

      <div className="collapse-content px-3 pb-3">
        <div className="grid grid-cols-2 gap-3 pt-2">
          {semester.courses.map((course) => (
            <div key={course.course_id} className="col-span-1">
              <CourseCard
                course={course}
                status={course.status as CourseStatus}
                historyItem={course.historyItem}
                missingRequirements={course.missingRequirements}
                onClick={() => onCourseClick?.(course)}
                compact={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
