import { Activity } from "lucide-react";
import type { RecentActivityItem } from "../../activities/types";

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
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

  return (
    <div className="rounded border border-white/10 bg-[#09090b] p-4 space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-primary" /> Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="py-6 text-center text-gray-500 text-xs italic">
          No recent activity recorded.
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">
                  {activity.actor?.username || "System"}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {formatTimeAgo(activity.created_at)}
                </span>
              </div>

              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {activity.description}
              </p>

              {(activity.project_name || activity.issue_key) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {activity.project_name && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono">
                      {activity.project_name}
                    </span>
                  )}
                  {activity.issue_key && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary font-mono">
                      {activity.issue_key}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
