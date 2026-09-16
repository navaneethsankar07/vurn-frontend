import ReactMarkdown from "react-markdown";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface SprintOverviewSectionProps {
  goal: string;
  description: string;
  startDate: string;
  endDate: string;
  createdByName: string;
  updatedAt: string;
}

export function SprintOverviewSection({
  goal,
  description,
  startDate,
  endDate,
  createdByName,
  updatedAt,
}: SprintOverviewSectionProps) {
  return (
    <div className="bg-[#09090B] border border-white/10 rounded-xs p-4 space-y-4">
      <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
        Overview
      </h2>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
            Sprint Goal
          </p>
          <p className="text-xs text-zinc-300 font-sans mt-0.5">
            {goal || "None"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
            Description
          </p>
          <div className="text-xs text-zinc-300 font-sans mt-0.5 prose prose-invert max-w-none [&_p]:m-0">
            {description ? (
              <ReactMarkdown>{description}</ReactMarkdown>
            ) : (
              <span className="text-zinc-600 italic">
                No description provided.
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/5 text-xs">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Duration
            </p>
            <p className="text-zinc-300 font-sans mt-0.5">
              {startDate} – {endDate}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Created By
            </p>
            <p className="text-zinc-300 font-sans mt-0.5">{createdByName}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
              Last Updated
            </p>
            <p className="text-zinc-300 font-sans mt-0.5">
              {formatRelativeTime(updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
