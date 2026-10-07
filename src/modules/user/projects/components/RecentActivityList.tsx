import {
  CircleCheck,
  CircleAlert,
  Sparkles,
  MessageSquare,
  GitPullRequest,
} from "lucide-react";

const RECENT_ACTIVITIES = [
  {
    id: "AUTH-142",
    action: "created",
    description: "Rotate refresh tokens on privilege change",
    time: "13m",
    icon: CircleAlert,
  },
  {
    id: "AUTH-138",
    action: "completed",
    description: "Enable multi-factor authentication with TOTP",
    time: "2h",
    icon: CircleCheck,
  },
  {
    id: "Sprint 24",
    action: "started",
    description: "24 issues planned · 8 days remaining",
    time: "3h",
    icon: Sparkles,
  },
  {
    id: "Comment added on AUTH-136",
    action: "",
    description: "Review requested by Priya Rajan",
    time: "5h",
    icon: MessageSquare,
  },
  {
    id: "Pull request linked",
    action: "",
    description: "#482 - Reduce token verification latency p99",
    time: "Yesterday",
    icon: GitPullRequest,
  },
  {
    id: "AUTH-120",
    action: "closed",
    description: "Configure Redis cache fallback policy for session stores",
    time: "2d ago",
    icon: CircleCheck,
  },
];

export function RecentActivityList() {
  return (
    <div className="border border-white/10 rounded  p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <button className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer">
          View all
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {RECENT_ACTIVITIES.map((activity, idx) => {
          const IconComp = activity.icon;
          return (
            <div
              key={idx}
              className="py-3 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <IconComp className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">
                    {activity.id}{" "}
                    {activity.action && (
                      <span className="text-gray-400 font-normal">
                        {activity.action}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-400 text-[11px] truncate mt-0.5 font-sans">
                    {activity.description}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 shrink-0">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
