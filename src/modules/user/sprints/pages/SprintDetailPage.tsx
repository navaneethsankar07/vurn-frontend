import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useSprintDetail } from "../api/sprintQueries";
import { SprintHeader } from "../components/SprintHeader";
import { SprintOverviewSection } from "../components/SprintOverviewSection";
import { SprintIssuesTable } from "../components/SprintIssuesTable";
import { SprintSidebar } from "../components/SprintSidebar";
import { getSubdomain } from "@/utils/subdomain";

export function SprintDetailPage() {
  const {projectSlug = "", sprintId = "" } = useParams();
  const navigate = useNavigate();
  const subdomain = getSubdomain() || "";

  const {
    data: sprint,
    isLoading,
    isError,
  } = useSprintDetail(subdomain, projectSlug, sprintId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-zinc-400 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Loading sprint details...
      </div>
    );
  }

  if (isError || !sprint) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-400 font-mono text-xs bg-[#09090B] border border-white/10 rounded-xs p-6">
        <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
        Failed to load sprint details. Please check parameters and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono p-6 max-w-7xl mx-auto">
      <SprintHeader
        sprintName={sprint.name}
        status={sprint.status}
        goal={sprint.goal}
        startDate={sprint.start_date}
        endDate={sprint.end_date}
        completionPercentage={sprint.completionPercentage}
        onBack={() =>
          navigate(
            `/projects/${projectSlug}/sprints`,
          )
        }
        onEdit={() => {}}
        onStart={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SprintOverviewSection
            goal={sprint.goal}
            description={sprint.description}
            startDate={sprint.start_date}
            endDate={sprint.end_date}
            createdByName="Priya Raman"
            updatedAt={sprint.updated_at}
          />

          <SprintIssuesTable issues={sprint.issues} onAddIssues={() => {}} />
        </div>

        <div className="lg:col-span-1">
          <SprintSidebar
            status={sprint.status}
            createdByName="Priya Raman"
            createdAt={sprint.created_at}
            updatedAt={sprint.updated_at}
            totalIssues={sprint.issues.length}
            completedIssues={sprint.completedIssuesCount}
            openIssues={sprint.openIssuesCount}
            remainingIssues={sprint.remainingIssuesCount}
            totalPoints={sprint.totalPoints}
            completedPoints={sprint.completedPoints}
            activities={sprint.activities}
          />
        </div>
      </div>
    </div>
  );
}
