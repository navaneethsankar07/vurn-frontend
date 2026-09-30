import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import {
  useSprintDetail,
  useSprintIssues,
  useProjectSprints,
} from "../api/sprintQueries";
import { useStartProjectSprint } from "../api/sprintMutations";
import { SprintHeader } from "../components/SprintHeader";
import { SprintOverviewSection } from "../components/SprintOverviewSection";
import { SprintIssuesTable } from "../components/SprintIssuesTable";
import { SprintSidebar } from "../components/SprintSidebar";
import { EditSprintModal } from "../components/modals/EditSprintModal";
import { CompleteSprintModal } from "../components/modals/CompleteSprintModal";
import { CreateIssueModal } from "../../issues/components/modals/CreateIssueModal";
import { useModal } from "@/hooks/useModal";
import { getSubdomain } from "@/utils/subdomain";
import {
  calculateSprintProgress,
  formatRelativeTime,
} from "@/utils/sprintHelpers";
import type { SprintIssue, Sprint } from "../types";
import { DUMMY_SPRINT_EXTENDED } from "../constants";

export function SprintDetailPage() {
  const { projectSlug = "", sprintId = "" } = useParams();
  const navigate = useNavigate();
  const subdomain = getSubdomain() || "";

  const [page, setPage] = useState(1);

  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const completeSprintModal = useModal();
  const createIssueModal = useModal();

  const {
    data: sprintMeta,
    isLoading: isSprintLoading,
    isError: isSprintError,
  } = useSprintDetail(subdomain, projectSlug, sprintId);

  const { data: issuesData, isLoading: isIssuesLoading } = useSprintIssues(
    subdomain,
    projectSlug,
    sprintId,
    page,
  );

  const { data: projectSprintsData } = useProjectSprints(
    subdomain,
    projectSlug,
    { status: "planned" },
  );

  const { mutate: startSprint, isPending: isStarting } =
    useStartProjectSprint();

  const handleStartSprint = () => {
    if (!sprintId) return;
    startSprint({
      subdomain,
      projectSlug,
      sprintId,
    });
  };

  if (isSprintLoading || isIssuesLoading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-zinc-400 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Loading sprint details...
      </div>
    );
  }

  if (isSprintError || !sprintMeta) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-400 font-mono text-xs bg-[#09090B] border border-white/10 rounded-xs p-6">
        <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
        Failed to load sprint details. Please check parameters and try again.
      </div>
    );
  }

  const rawIssues = issuesData?.results || [];
  const totalCount = issuesData?.count || 0;
  const totalPages = Math.ceil(totalCount / 5) || 1;

  const mappedIssues: SprintIssue[] = rawIssues.map((item) => ({
    key: item.key,
    title: item.title,
    status: item.status_name,
    priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    assignee: {
      id: item.assignee_id || 0,
      name: item.assignee_name || "Unassigned",
    },
    storyPoints: item.story_points ?? 0,
    updatedAt: formatRelativeTime(item.updated_at),
  }));

  const totalPoints = mappedIssues.reduce((acc, i) => acc + i.storyPoints, 0);
  const completedIssues = mappedIssues.filter(
    (i) =>
      i.status.toLowerCase() === "done" ||
      i.status.toLowerCase() === "completed",
  );
  const completedPoints = completedIssues.reduce(
    (acc, i) => acc + i.storyPoints,
    0,
  );
  const remainingPoints = Math.max(0, totalPoints - completedPoints);
  const openIssuesCount = mappedIssues.length - completedIssues.length;

  const sprint = {
    ...sprintMeta,
    ...DUMMY_SPRINT_EXTENDED,
    created_by_name: (sprintMeta as any).created_by_name || "System",
    issues: mappedIssues,
    totalPoints,
    completedPoints,
    remainingPoints,
    openIssuesCount,
    completedIssuesCount: completedIssues.length,
    remainingIssuesCount: openIssuesCount,
  };

  const projectSprintsList: Sprint[] = projectSprintsData?.results || [];
  const plannedSprintOptions = projectSprintsList
    .filter((s: Sprint) => String(s.id) !== String(sprintId))
    .map((s: Sprint) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-6 font-mono p-6 max-w-7xl mx-auto">
      <SprintHeader
        sprintName={sprint.name}
        status={sprint.status}
        goal={sprint.goal}
        startDate={sprint.start_date}
        endDate={sprint.end_date}
        completionPercentage={calculateSprintProgress(
          sprint.start_date,
          sprint.end_date,
          sprint.status,
        )}
        isStarting={isStarting}
        onBack={() => navigate(`/projects/${projectSlug}/sprints`)}
        onEdit={openEditModal}
        onStart={handleStartSprint}
        onComplete={completeSprintModal.openModal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SprintOverviewSection
            goal={sprint.goal}
            description={sprint.description}
            startDate={sprint.start_date}
            endDate={sprint.end_date}
            createdByName={sprint.created_by_name}
            updatedAt={sprint.updated_at}
          />

          <SprintIssuesTable
            issues={sprint.issues}
            onAddIssues={createIssueModal.openModal}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={totalCount}
          />
        </div>

        <div className="lg:col-span-1">
          <SprintSidebar
            status={sprint.status}
            createdByName={sprint.created_by_name}
            createdAt={sprint.created_at}
            updatedAt={sprint.updated_at}
            totalIssues={totalCount}
            completedIssues={sprint.completedIssuesCount}
            openIssues={sprint.openIssuesCount}
            remainingIssues={sprint.remainingIssuesCount}
            totalPoints={sprint.totalPoints}
            completedPoints={sprint.completedPoints}
            activities={sprint.activities}
          />
        </div>
      </div>

      <EditSprintModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        sprint={sprint}
      />

      <CompleteSprintModal
        isOpen={completeSprintModal.isOpen}
        onClose={completeSprintModal.closeModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        sprintId={sprintId}
        plannedSprints={plannedSprintOptions}
      />

      <CreateIssueModal
        isOpen={createIssueModal.isOpen}
        onClose={createIssueModal.closeModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        defaultSprintId={String(sprintId)}
        sprints={[
          {
            id: Number(sprintId),
            name: sprint.name,
            status: sprint.status,
          },
        ]}
      />
    </div>
  );
}
