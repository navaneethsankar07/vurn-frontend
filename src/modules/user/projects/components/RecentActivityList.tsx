import {
  CircleCheck,
  CircleAlert,
  Sparkles,
  Loader2,
  Activity,
} from "lucide-react";
import { useRecentActivities } from "../../activities/api/recentActivityQueries";
import type { RecentActivityItem } from "../../activities/types";
interface RecentActivityListProps {
  subdomain: string;
  projectSlug: string;
}

export function RecentActivityList({
  subdomain,
  projectSlug,
}: RecentActivityListProps) {
  const { data: activities, isLoading } = useRecentActivities({
    scope: "project",
    organization_slug: subdomain,
    project_slug: projectSlug,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issue_completed":
      case "issue_closed":
        return CircleCheck;
      case "issue_created":
      case "issue_updated":
        return CircleAlert;
      case "sprint_created":
        return Sparkles;
      default:
        return Activity;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const activityList: RecentActivityItem[] = activities || [];

  return (
    <div className="border border-white/10 rounded p-5 space-y-4 font-mono bg-[#09090b]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading project activities...</span>
        </div>
      ) : activityList.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-xs italic">
          No recent activity found for this project.
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {activityList.map((activity) => {
            const IconComp = getActivityIcon(activity.activity_type);
            const title =
              activity.issue_key ||
              activity.sprint_name ||
              activity.project_name ||
              "Activity";

            return (
              <div
                key={activity.id}
                className="py-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <IconComp className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {title}{" "}
                      {activity.actor?.username && (
                        <span className="text-gray-400 font-normal text-[11px]">
                          by {activity.actor.username}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-[11px] truncate mt-0.5 font-sans">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">
                  {formatTimeAgo(activity.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
