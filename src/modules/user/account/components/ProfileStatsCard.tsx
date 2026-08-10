import type { ProfileStatsCardProps } from "../types";

export function ProfileStatsCard({ statistics }: ProfileStatsCardProps) {
  const statList = [
    { label: "Organizations Joined", value: statistics.organizations_joined },
    { label: "Projects", value: statistics.projects },
    { label: "Assigned Issues", value: statistics.assigned_issues },
    { label: "Completed Issues", value: statistics.completed_issues },
    { label: "Comments", value: statistics.comments },
    {
      label: "GitHub Linked Projects",
      value: statistics.github_linked_projects,
    },
  ];

  return (
    <div className="rounded-[3px] border border-white/10 bg-[#0C0C0E] font-mono overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-normal text-white">Statistics</h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/10">
        {statList.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0C0C0E] px-5 py-5 flex flex-col justify-center"
          >
            <span className="text-xl sm:text-2xl font-normal text-white">
              {stat.value}
            </span>
            <span className="text-xs text-gray-400 mt-2">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
