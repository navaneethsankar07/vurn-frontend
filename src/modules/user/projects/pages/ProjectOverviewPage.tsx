import { Loader2 } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useParams } from "react-router-dom";
import { useProjectDashboard } from "../api/projectQueries";
import { ProjectStatsGrid } from "../components/ProjectStatsGrid";
import { RecentActivityList } from "../components/RecentActivityList";
import { ProjectOverviewSidebar } from "../components/ProjectOverviewSidebar";

export function ProjectOverviewPage() {
  const subdomain = getSubdomain() || "";
  const { projectSlug } = useParams<{ projectSlug: string }>();

  const { data, isLoading, isError } = useProjectDashboard(
    subdomain,
    projectSlug || "",
  );

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading project overview...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-64 border border-red-500/20 bg-red-500/5 rounded p-6 flex items-center justify-center text-red-400 text-xs font-mono">
        Failed to load project overview data.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProjectStatsGrid data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityList />
        </div>

        <div className="space-y-6">
          <ProjectOverviewSidebar data={data} />
        </div>
      </div>
    </div>
  );
}
