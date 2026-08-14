import type { RecentActivity as ActivityItem } from "../types";

export function RecentActivity({
  activities,
}: {
  activities: ActivityItem[];
}) {
  return (
    <div className="rounded border border-white/10 bg-[#09090b] p-4 space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Recent Activity
      </h3>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="text-xs leading-relaxed space-y-0.5">
            <p className="text-gray-300">
              <span className="font-semibold text-white">{activity.user}</span>{" "}
              <span className="text-gray-400">{activity.action}</span>{" "}
              <span className="text-amber-500">{activity.target}</span>
            </p>
            <span className="text-[10px] text-gray-500 block">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}