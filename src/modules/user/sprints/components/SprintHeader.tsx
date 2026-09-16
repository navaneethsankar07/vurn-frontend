import { ArrowLeft, Sparkles, Edit3, Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SprintStatus } from "../types";

interface SprintHeaderProps {
  sprintName: string;
  status: SprintStatus;
  goal: string;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  onBack: () => void;
  onEdit: () => void;
  onStart: () => void;
}

export function SprintHeader({
  sprintName,
  status,
  goal,
  startDate,
  endDate,
  completionPercentage,
  onBack,
  onEdit,
  onStart,
}: SprintHeaderProps) {
  const getBadgeStyle = (s: SprintStatus) => {
    switch (s) {
      case "active":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "planned":
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sprints
      </button>

      <div className="bg-[#09090B] border border-white/10 p-5 rounded-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {sprintName}
              </h1>
              <span
                className={`text-[10px] uppercase font-semibold px-2 py-0.5 border rounded-xs flex items-center gap-1.5 ${getBadgeStyle(
                  status,
                )}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current inline-block" />
                {status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans max-w-2xl">{goal}</p>
            <p className="text-[11px] text-zinc-500 pt-1">
              {startDate} – {endDate}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/10 bg-black text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-xs gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Generate Sprint Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8 text-xs border-white/10 bg-black text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-xs gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Sprint
            </Button>
            <Button
              size="sm"
              onClick={onStart}
              className="h-8 text-xs bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xs gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Start Sprint
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-white/10 bg-black text-zinc-400 hover:text-white rounded-xs"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500 uppercase tracking-wider font-semibold">
              Completion
            </span>
            <span className="text-white font-bold">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 border border-white/5 overflow-hidden rounded-xs">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
