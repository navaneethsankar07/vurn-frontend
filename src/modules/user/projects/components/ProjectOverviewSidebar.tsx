import {
  GitBranch,
  Calendar,
  Clock,
  Target,
  User,
  FileText,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { ProjectDashboardData } from "../types";

interface ProjectOverviewSidebarProps {
  data?: ProjectDashboardData;
}

export function ProjectOverviewSidebar({ data }: ProjectOverviewSidebarProps) {
  const activeSprint = data?.active_sprint;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="relative overflow-hidden border border-white/10 rounded-sm  p-5 space-y-4 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Active Sprint
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {activeSprint?.status || "No Active Sprint"}
          </span>
        </div>

        {activeSprint ? (
          <div className="space-y-4 text-xs relative z-10">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                Sprint Name
              </span>
              <span className="text-sm font-bold text-white mt-2 tracking-tight flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-amber-500 shrink-0" />
                {activeSprint.name}
              </span>
            </div>

            {activeSprint.description && (
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="h-3 w-3 text-zinc-400" />
                  Description
                </span>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-white/2 p-2.5 rounded-xs border border-white/5">
                  {activeSprint.description}
                </p>
              </div>
            )}

            {activeSprint.goal ? (
              <>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-zinc-400" />
                  Sprint Goal
                </span>
                <div className="space-y-1 p-3 rounded-xs  border border-white/5">
                  <p className="text-xs text-zinc-200 font-sans leading-relaxed mt-1">
                    {activeSprint.goal}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-2.5 rounded-xs bg-black/40 border border-white/5 text-[11px] text-zinc-500 italic font-sans">
                No specific goal defined for this sprint.
              </div>
            )}

            <div className="p-3 rounded-xs bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
                  <Calendar className="h-3 w-3 text-amber-500" />
                  Timeline
                </span>
                <span className="font-semibold text-white text-[11px]">
                  {formatDate(activeSprint.start_date)} —{" "}
                  {formatDate(activeSprint.end_date)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500">
              {activeSprint.created_by_name && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-zinc-400" />
                    Created by
                  </span>
                  <span className="text-zinc-300 font-medium">
                    {activeSprint.created_by_name}
                  </span>
                </div>
              )}

              {activeSprint.created_at && (
                <div className="flex items-center justify-between">
                  <span>Created Date</span>
                  <span className="text-zinc-300">
                    {formatDate(activeSprint.created_at)}
                  </span>
                </div>
              )}

              {activeSprint.updated_at && (
                <div className="flex items-center justify-between">
                  <span>Last Updated</span>
                  <span className="text-amber-400/90 font-medium">
                    {formatRelativeTime(activeSprint.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-500 text-xs space-y-2 relative z-10">
            <Clock className="h-6 w-6 mx-auto text-zinc-600 animate-pulse" />
            <p className="font-sans">
              No active sprint scheduled for this project right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
