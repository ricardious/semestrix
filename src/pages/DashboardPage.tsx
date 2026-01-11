import { useState } from "react";
import { useMyProfile } from "@services/profiles/queries";
import { useCurrentUser } from "@services/auth/queries";
import { usePrograms } from "@services/programs/queries";
import {
  useCourseProgress,
  CourseProgressNode,
} from "@lib/hooks/useCourseProgress";
import {
  useUpdateManualHistoryEntry,
  useCreateManualHistoryEntry,
} from "@services/history/mutations";
import { useMyHistory } from "@services/history/queries";
import { ManualUpdateRequest, ManualCreateRequest } from "@lib/types/api";
import DashboardLayout from "@components/templates/DashboardLayout";
import DashboardCurriculumBoard from "@organisms/DashboardCurriculumBoard";
import UserProfileCard from "@molecules/UserProfileCard";
import StatsCard from "@molecules/StatsCard";
import CourseTable from "@molecules/CourseTable";
import CourseEditModal from "@molecules/CourseEditModal";
import SvgIcon from "@atoms/SvgIcon";

export default function DashboardPage() {
  const { data: profile } = useMyProfile();
  const { data: user } = useCurrentUser();
  const { data: programs } = usePrograms();
  const { semesters, overallProgress, extracurriculars, error } =
    useCourseProgress(profile?.current_version_id || null);

  const [activeTab, setActiveTab] = useState<"board" | "list">("board");

  // Course edit modal state
  const [selectedCourse, setSelectedCourse] =
    useState<CourseProgressNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mutations
  const updateMutation = useUpdateManualHistoryEntry();
  const createMutation = useCreateManualHistoryEntry();

  const handleCourseClick = (course: CourseProgressNode) => {
    // Don't open modal for locked courses
    if (course.status === "locked") return;

    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = (
    historyId: number | null,
    data: ManualUpdateRequest
  ) => {
    if (historyId) {
      // Update existing history entry
      updateMutation.mutate(
        { historyId, data },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      // Create new history entry
      const createData: ManualCreateRequest = {
        course_id: data.course_id,
        year: data.year!,
        term: data.term!,
        grade: data.grade,
        status: data.status!,
      };
      createMutation.mutate(createData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const programName = programs?.find(
    (p) => p.program_id === profile?.current_program_id
  )?.program_name;

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-error">
            Error al cargar datos
          </h2>
          <p className="text-base-content/60 dark:text-white/60">
            No se pudo cargar tu perfil o el pensum.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // View toggle actions for the header
  const viewToggleActions = (
    <div className="flex rounded-lg border border-base-content/10 bg-base-100/80 p-1 dark:border-white/10 dark:bg-base-dark/50">
      <button
        onClick={() => setActiveTab("board")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
          activeTab === "board"
            ? "bg-primary text-white shadow-sm"
            : "text-base-content/60 hover:bg-base-200/50 hover:text-base-content dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
        }`}
      >
        <SvgIcon name="squares-2x2" className="h-4 w-4" />
        <span className="hidden sm:inline">Mapa</span>
      </button>
      <button
        onClick={() => setActiveTab("list")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
          activeTab === "list"
            ? "bg-primary text-white shadow-sm"
            : "text-base-content/60 hover:bg-base-200/50 hover:text-base-content dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
        }`}
      >
        <SvgIcon name="list-bullet" className="h-4 w-4" />
        <span className="hidden sm:inline">Lista</span>
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Mi Progreso Académico"
      subtitle={programName || "Cargando programa..."}
      actions={viewToggleActions}
    >
      {/* User Profile Card */}
      <div className="mb-8">
        <UserProfileCard
          user={user}
          profile={profile}
          programName={programName}
        />
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard
          label="Créditos"
          value={`${overallProgress.approvedCredits} / ${overallProgress.totalCredits}`}
          icon="dictionary-language-book"
          variant="primary"
        />
        <StatsCard
          label="Avance"
          value={`${
            overallProgress.totalCredits > 0
              ? Math.round(
                  (overallProgress.approvedCredits /
                    overallProgress.totalCredits) *
                    100
                )
              : 0
          }%`}
          icon="graph-bar-increase"
          variant="secondary"
        />
        <StatsCard
          label="Materias"
          value={`${overallProgress.completedCount} / ${overallProgress.totalCount}`}
          icon="circle-check"
          variant="success"
        />
        <StatsCard
          label="Semestre"
          value={profile?.current_semester?.toString() || "-"}
          icon="calendar-check"
          variant="info"
        />
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">
        {activeTab === "board" ? (
          <div className="space-y-8">
            <DashboardCurriculumBoard
              semesters={semesters}
              onCourseClick={handleCourseClick}
            />

            {/* Extracurriculars Section */}
            {extracurriculars.length > 0 && (
              <div className="mt-12 rounded-2xl border border-base-content/10 bg-base-100/30 p-6 backdrop-blur dark:border-white/10 dark:bg-base-dark/20">
                <h3 className="mb-4 text-base font-bold text-base-content/80 dark:text-white/80">
                  Otros Créditos / No en Pensum
                </h3>
                <div className="overflow-x-auto">
                  <CourseTable items={extracurriculars} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-base-content/10 bg-base-100/30 p-1 backdrop-blur dark:border-white/10 dark:bg-base-dark/20 md:p-6">
            <HistoryListView />
          </div>
        )}
      </div>

      {/* Course Edit Modal */}
      <CourseEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        historyItem={selectedCourse?.historyItem}
        onSave={handleSaveCourse}
        isLoading={updateMutation.isPending || createMutation.isPending}
      />
    </DashboardLayout>
  );
}

function HistoryListView() {
  const { data: history } = useMyHistory();
  if (!history) return null;
  return <CourseTable items={history} limit={100} />;
}
