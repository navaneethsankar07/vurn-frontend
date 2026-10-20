import {
  CircleCheck,
  CircleAlert,
  MessageSquare,
  Loader2,
  Activity,
  CircleCheckBig,
} from "lucide-react";
import { useRecentActivities } from "../../activities/api/recentActivityQueries";
import type { RecentActivityItem } from "../../activities/types";
import { formatRelativeTime } from "@/utils/date";

export function HomeRecentActivitySection() {
  const { data: activities, isLoading } = useRecentActivities({
    scope: "home",
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
        return CircleCheckBig;
      case "invitation_accepted":
        return MessageSquare;
      default:
        return Activity;
    }
  };

  const activityList: RecentActivityItem[] = activities || [];

  return (
    <div className="border border-white/10 rounded p-5 space-y-4 font-mono bg-[#09090b]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Recent Notifications
        </h3>
        
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading recent activities...</span>
        </div>
      ) : activityList.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 text-xs italic">
          No recent activity found.
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {activityList.slice(0, 5).map((activity) => {
            const IconComp = getActivityIcon(activity.activity_type);

            return (
              <div
                key={activity.id}
                className="py-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <IconComp className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      <span className="font-semibold text-primary">
                        {activity.actor?.username || "System"}
                      </span>{" "}
                      <span className="text-zinc-300 font-normal">
                        {activity.description}
                      </span>
                      {activity.project_name && (
                        <span className="text-zinc-400 font-normal ml-1">
                          in {activity.project_name}
                        </span>
                      )}
                    </p>
                    <p className="text-zinc-400 text-[11px] truncate mt-0.5 font-sans">
                      {activity.metadata?.subtitle || activity.issue_key || ""}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                  {formatRelativeTime(activity.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
