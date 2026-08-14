import { Settings, Plus } from "lucide-react";
import { useOrganizationDashboardQuery } from "../api/organizationQueries";
import { RecentProjects } from "../components/RecentProjects";
import { ActiveSprints } from "../components/ActiveSprints";
import { QuickActions } from "../components/QuickActions";
import { RecentActivity } from "../components/RecentActivity";
import { getSubdomain } from "@/utils/subdomain";

export function OrganizationDashboard() {
  const subdomain = getSubdomain();
  const { data, isLoading, isError, error } = useOrganizationDashboardQuery(
    subdomain ?? undefined,
  );

  if (!subdomain) {
    return <div>No active organization subdomain detected.</div>;
  }

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (isError) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono">
      {/* Title & Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {data.name}
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            {data.description || "No description provided for this organization."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded border border-white/10 bg-[#09090b] px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Organization Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="rounded border border-white/10 bg-[#09090b] p-3.5">
            <span className="text-xl font-bold text-white block">
              {data.metrics.total_projects}
            </span>
            <span className="text-[10px] text-gray-500 uppercase mt-1 block">
              Total Projects
            </span>
          </div>
          <div className="rounded border border-white/10 bg-[#09090b] p-3.5">
            <span className="text-xl font-bold text-white block">
              {data.metrics.active_sprints}
            </span>
            <span className="text-[10px] text-gray-500 uppercase mt-1 block">
              Active Sprints
            </span>
          </div>
          <div className="rounded border border-white/10 bg-[#09090b] p-3.5">
            <span className="text-xl font-bold text-white block">
              {data.metrics.members_count}
            </span>
            <span className="text-[10px] text-gray-500 uppercase mt-1 block">
              Members
            </span>
          </div>
          <div className="rounded border border-white/10 bg-[#09090b] p-3.5">
            <span className="text-xl font-bold text-white block">
              {data.metrics.open_issues}
            </span>
            <span className="text-[10px] text-gray-500 uppercase mt-1 block">
              Open Issues
            </span>
          </div>
          <div className="rounded border border-white/10 bg-[#09090b] p-3.5">
            <span className="text-xl font-bold text-white block">
              {data.metrics.completed_issues.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-500 uppercase mt-1 block">
              Completed Issues
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentProjects projects={data.recent_projects} />
          <ActiveSprints sprints={data.active_sprints} />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <RecentActivity activities={data.recent_activities} />
        </div>
      </div>
    </div>
  );
}