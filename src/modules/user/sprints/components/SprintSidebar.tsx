import type { SprintActivity, SprintStatus } from "../types";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import { format, parseISO } from "date-fns";

interface SprintSidebarProps {
  status: SprintStatus;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  totalIssues: number;
  completedIssues: number;
  openIssues: number;
  remainingIssues: number;
  totalPoints: number;
  completedPoints: number;
  activities: SprintActivity[];
}

export function SprintSidebar({
  status,
  createdByName,
  createdAt,
  updatedAt,
  totalIssues,
  completedIssues,
  openIssues,
  remainingIssues,
  totalPoints,
  completedPoints,
  activities,
}: SprintSidebarProps) {
  const formattedCreatedAt = createdAt
    ? format(parseISO(createdAt), "MMM d, yyyy")
    : "";

  return (
    <div className="space-y-4">
      <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
          Sprint Information
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Status</span>
            <span className="text-zinc-300 capitalize font-mono text-[11px]">
              {status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Created By</span>
            <span className="text-zinc-300 font-sans">{createdByName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Created</span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {formattedCreatedAt}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Updated</span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {formatRelativeTime(updatedAt)}
            </span>
          </div>
        </div>
      </div>

      

      <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
          Sprint Statistics
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-white font-mono">
              {totalIssues}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Total Issues
            </p>
          </div>
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {completedIssues}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Completed
            </p>
          </div>
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-amber-400 font-mono">
              {openIssues}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Open
            </p>
          </div>
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-zinc-400 font-mono">
              {remainingIssues}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Remaining
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-white font-mono">
              {totalPoints}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Total Points
            </p>
          </div>
          <div className="p-2.5 bg-black border border-white/5 rounded-xs">
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {completedPoints}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-sans">
              Points Done
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
          Recent Activity
        </h3>
        <div className="space-y-2.5">
          {activities.map((act) => (
            <div key={act.id} className="text-xs space-y-0.5">
              <p className="text-zinc-300 font-sans">
                <span className="font-semibold text-white">{act.user}</span>{" "}
                {act.detail}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                {act.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
