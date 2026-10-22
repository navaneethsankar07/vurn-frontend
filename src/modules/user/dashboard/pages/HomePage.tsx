import { Loader2 } from "lucide-react";
import { useDashboardRecentActivity } from "../api/dashboardQueries";
import { ContinueWorkingSection } from "../components/ContinueWorkingSection";
import { RecentOrganizationsSection } from "../components/RecentOrganizationsSection";
import { PendingInvitationsSection } from "../components/PendingInvitationsSection";
import { HomeRecentActivitySection } from "../components/HomeRecentActivitySection";

export function HomePage() {
  const { data, isLoading, isError } = useDashboardRecentActivity();

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading personal workspace...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="border border-red-500/20 bg-red-500/5 rounded p-6 text-red-400 text-xs font-mono text-center">
          Failed to load dashboard recent activity.
        </div>
      </div>
    );
  }

  const recentIssues = data?.recent_issues || [];
  const recentOrganizations = data?.recent_organizations || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-1 py-3 space-y-7 select-none">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-white font-mono">Home</h1>
        <p className="text-xs text-zinc-400 font-mono">
          Your personal workspace. Continue where you left off or manage your
          organizations.
        </p>
      </div>

      <ContinueWorkingSection issues={recentIssues} />

      <RecentOrganizationsSection organizations={recentOrganizations} />

      <PendingInvitationsSection />

      <HomeRecentActivitySection />
    </div>
  );
}
