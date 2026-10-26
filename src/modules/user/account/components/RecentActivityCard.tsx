import {
  MessageSquare,
  Loader2,
  Activity,
  CircleCheckBig,
  CheckCircle2,
  GitCommit,
} from "lucide-react";
import { useRecentActivities } from "@/modules/user/activities/api/recentActivityQueries";
import type { RecentActivityItem } from "@/modules/user/activities/types";
import { formatRelativeTime } from "@/utils/date";

export function RecentActivityCard() {
  const { data: activities, isLoading } = useRecentActivities({
    scope: "home",
  });


  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issue_completed":
      case "issue_closed":
        return CheckCircle2;
      case "issue_created":
      case "issue_updated":
        return GitCommit;
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
    <div className="border border-white/10 rounded-[3px] p-5 space-y-4 font-mono bg-[#0C0C0E]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Recent Activity
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
                className="py-2.5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <IconComp className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      <span className="text-zinc-300 font-normal">
                        {activity.description}
                      </span>
                      {activity.project_name && (
                        <span className="text-zinc-400 font-normal ml-1">
                          in {activity.project_name}
                        </span>
                      )}
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
