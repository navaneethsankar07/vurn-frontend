import type { ActiveSprint } from "../types";

export function ActiveSprints({ sprints }: { sprints: ActiveSprint[] }) {
  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Active Sprints ({sprints.length})
      </h3>

      <div className="space-y-2">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="rounded border border-white/10 bg-[#09090b] p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                  {sprint.project_code}
                </span>
                <span className="text-xs font-bold text-white">
                  {sprint.name}
                </span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                  sprint.status === "Active"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                }`}
              >
                {sprint.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${sprint.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>
                {sprint.start_date} - {sprint.end_date}
              </span>
              <span>{sprint.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
