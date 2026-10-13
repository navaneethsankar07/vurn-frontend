import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiEstimateStoryPoints } from "../api/aiMutations";
import type { AiEstimateResponse } from "../types";

interface IssueAiEstimateSectionProps {
  issueId: number | string;
  onApplyPoints: (points: number) => void;
}

export function IssueAiEstimateSection({
  issueId,
  onApplyPoints,
}: IssueAiEstimateSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasEstimated, setHasEstimated] = useState(false);
  const [estimateData, setEstimateData] = useState<AiEstimateResponse | null>(
    null,
  );
  const [isApplied, setIsApplied] = useState(false);

  const { mutate: estimatePoints, isPending } = useAiEstimateStoryPoints();

  const handleEstimate = () => {
    estimatePoints(
      { issue_id: issueId },
      {
        onSuccess: (data) => {
          setEstimateData(data);
          setHasEstimated(true);
          setIsOpen(true);
          setIsApplied(false);
        },
      },
    );
  };

  const handleApply = () => {
    if (estimateData) {
      onApplyPoints(estimateData.estimated_story_points);
      setIsApplied(true);
    }
  };

  const getConfidenceBadgeColor = (confidence?: string) => {
    switch (confidence) {
      case "high":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-zinc-300 font-mono tracking-tight">
          Story Point Estimation
        </span>
        <div className="flex items-center gap-2">
          {hasEstimated && (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors"
            >
              {isOpen ? (
                <>
                  Hide <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show Estimate <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
          <Button
            type="button"
            onClick={handleEstimate}
            disabled={isPending}
            className="h-7 px-2.5 text-xs bg-transparent hover:bg-transparent text-primary hover:text-primary/80 border border-primary/30 rounded-xs font-mono cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Estimating...
              </>
            ) : hasEstimated ? (
              "Re-estimate"
            ) : (
              "Estimate Points"
            )}
          </Button>
        </div>
      </div>

      {isOpen && hasEstimated && estimateData && (
        <div className="bg-black/60 border border-primary/20 p-3 rounded-xs space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300 font-mono">
                Suggested Points:
              </span>
              <span className="px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-xs font-bold rounded font-mono">
                {estimateData.estimated_story_points} SP
              </span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded border uppercase font-mono ${getConfidenceBadgeColor(
                estimateData.confidence,
              )}`}
            >
              {estimateData.confidence} confidence
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {estimateData.rationale}
          </p>

          {estimateData.assumptions && estimateData.assumptions.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Assumptions:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
                {estimateData.assumptions.map((assumption, idx) => (
                  <li key={idx}>{assumption}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-zinc-500 italic font-mono">
              Review before applying.
            </span>
            <Button
              type="button"
              size="sm"
              disabled={isApplied}
              onClick={handleApply}
              className={`h-7 px-3 text-xs font-mono rounded-xs cursor-pointer ${
                isApplied
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-primary text-black hover:bg-primary/90 font-semibold"
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="h-3 w-3 mr-1" /> Applied
                </>
              ) : (
                "Update Story Points"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
