import { Loader2, Activity } from "lucide-react";
import { useRecentActivities } from "../../activities/api/recentActivityQueries";
import type { RecentActivityItem } from "../../activities/types";
import { formatRelativeTime } from "@/utils/date";

interface SprintActivityListProps {
  subdomain: string;
  projectSlug: string;
  sprintId: string | number;
}

export function SprintActivityList({
  subdomain,
  projectSlug,
  sprintId,
}: SprintActivityListProps) {
  const { data: activities, isLoading } = useRecentActivities({
    scope: "sprint",
    organization_slug: subdomain,
    project_slug: projectSlug,
    sprint_id: sprintId,
  });

  const activityList: RecentActivityItem[] = activities || [];

  return (
    <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-3 font-mono">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-primary" /> Recent Activity
      </h3>

      {isLoading ? (
        <div className="py-6 flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading activities...</span>
        </div>
      ) : activityList.length === 0 ? (
        <div className="py-4 text-center text-zinc-500 text-xs italic font-sans">
          No recent activity recorded for this sprint.
        </div>
      ) : (
        <div className="space-y-2.5">
          {activityList.map((act) => (
            <div
              key={act.id}
              className="text-xs space-y-0.5 border-b border-white/5 pb-2 last:border-0 last:pb-0"
            >
              <p className="text-zinc-300 font-sans">
                <span className="font-semibold text-white">
                  {act.actor?.username || "System"}
                </span>{" "}
                {act.description}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                {formatRelativeTime(act.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
