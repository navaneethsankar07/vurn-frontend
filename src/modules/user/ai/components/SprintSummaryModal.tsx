import { useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAiGenerateSprintSummary } from "../api/aiMutations";
import { getSubdomain } from "@/utils/subdomain";
import type { SprintSummaryData } from "../types";

interface SprintSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string;
  sprintId: number;
  sprintName: string;
}

export function SprintSummaryModal({
  isOpen,
  onClose,
  projectSlug,
  sprintId,
  sprintName,
}: SprintSummaryModalProps) {
  const [summaryData, setSummaryData] = useState<SprintSummaryData | null>(
    null,
  );
  const { mutate: generateSummary, isPending } = useAiGenerateSprintSummary();

  const handleGenerate = () => {
    const orgSlug = getSubdomain() || "default";

    generateSummary(
      {
        organization_slug: orgSlug,
        project_slug: projectSlug,
        sprint_id: sprintId,
      },
      {
        onSuccess: (data) => {
          setSummaryData(data.summary);
        },
      },
    );
  };

  const handleClose = () => {
    setSummaryData(null);
    onClose();
  };

  const metrics = summaryData?.metrics;
  const sprint = summaryData?.sprint;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono w-[95vw] max-w-5xl sm:max-w-5xl rounded-xs shadow-2xl p-0 overflow-hidden">
        <div className="p-6 space-y-6 max-h-[88vh] flex flex-col">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs border border-primary/30 bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                Sprint AI Report — {sprintName}
              </DialogTitle>
            </div>
            {!summaryData && (
              <DialogDescription className="text-xs text-zinc-400 font-sans">
                Generate an automated executive summary and progress report for
                this sprint using Vurn AI.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-125 overflow-y-auto space-y-6 pr-2 bg-black/40 p-4 rounded-xs border border-white/5">
            {!summaryData ? (
              <div className="h-full py-28 flex flex-col items-center justify-center space-y-4 text-center">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <div className="space-y-1 max-w-md">
                  <p className="text-xs font-semibold text-zinc-200">
                    Ready to analyze sprint progress?
                  </p>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Vurn AI will compile completed issues, velocity metrics, and
                    team performance into a comprehensive dashboard report.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="h-8 px-4 text-xs bg-primary text-black hover:bg-primary/90 font-semibold rounded-xs gap-2 cursor-pointer font-mono"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate Sprint Summary
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6 font-sans">
                {/* Sprint Header Info */}
                <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white font-mono">
                      {sprint?.name}
                    </h2>
                    <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 border border-primary/30 bg-primary/10 text-primary rounded-xs font-mono">
                      {sprint?.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    {sprint?.goal || "No sprint goal provided."}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {sprint?.start_date} – {sprint?.end_date} (
                    {sprint?.estimated_days} days)
                  </p>
                </div>

                {/* Metrics Grid */}
                {metrics && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                      Metrics & Scope
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-black/60 border border-white/10 p-3 rounded-xs space-y-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Total Issues
                        </span>
                        <p className="text-lg font-bold text-white font-mono">
                          {metrics.total_issues}
                        </p>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3 rounded-xs space-y-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Completed
                        </span>
                        <p className="text-lg font-bold text-emerald-400 font-mono">
                          {metrics.completed_issues}
                        </p>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3 rounded-xs space-y-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Incomplete
                        </span>
                        <p className="text-lg font-bold text-amber-400 font-mono">
                          {metrics.incomplete_issues}
                        </p>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3 rounded-xs space-y-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Completion
                        </span>
                        <p className="text-lg font-bold text-primary font-mono">
                          {metrics.completion_percentage}%
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-900 h-1.5 border border-white/5 overflow-hidden rounded-xs mt-2">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${metrics.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Executive Summary */}
                <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Executive
                    Summary
                  </h3>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {summaryData.summary}
                  </p>
                </div>

                {/* Grid for Lists: Achievements, Incomplete Work, Risks, Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Achievements */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Key Achievements
                    </h3>
                    {summaryData.achievements.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                        {summaryData.achievements.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-500 italic font-mono">
                        No specific achievements identified.
                      </p>
                    )}
                  </div>

                  {/* Incomplete Work */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Incomplete Work
                    </h3>
                    {summaryData.incomplete_work.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300 font-mono">
                        {summaryData.incomplete_work.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-500 italic font-mono">
                        No incomplete work.
                      </p>
                    )}
                  </div>

                  {/* Risks & Concerns */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Risks & Concerns
                    </h3>
                    {summaryData.risks.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                        {summaryData.risks.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-500 italic font-mono">
                        No specific risks identified.
                      </p>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" /> Recommendations
                    </h3>
                    {summaryData.recommendations.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                        {summaryData.recommendations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-500 italic font-mono">
                        No additional recommendations.
                      </p>
                    )}
                  </div>
                </div>

                {/* Scope Change Insights */}
                {summaryData.scope_change_insights.length > 0 && (
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" /> Scope
                      Change Insights
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                      {summaryData.scope_change_insights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    {metrics && (
                      <div className="flex gap-4 pt-2 text-[11px] text-zinc-400 font-mono">
                        <span>
                          Added: {metrics.added_issue_keys.join(", ") || "None"}
                        </span>
                        <span>
                          Removed:{" "}
                          {metrics.removed_issue_keys.join(", ") || "None"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-transparent">
            {summaryData ? (
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isPending}
                className="h-8 text-xs bg-transparent text-primary hover:bg-transparent border border-primary/30 hover:border-primary font-semibold rounded-xs gap-2 cursor-pointer font-mono"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate Summary"
                )}
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-8 border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white text-xs rounded-xs font-sans transition-colors cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
