import { useState } from "react";
import {
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiTaskBreakdown } from "../api/aiMutations";
import { useCreateIssueSubtask } from "../../issues/api/issueMutations";
import type { AiSubtaskItem } from "../types";

interface IssueAiBreakdownSectionProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  issueTitle: string;
  issueDescription?: string | null;
  sprintId?: number | null;
}

export function IssueAiBreakdownSection({
  subdomain,
  projectSlug,
  issueId,
  issueTitle,
  issueDescription,
  sprintId,
}: IssueAiBreakdownSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<AiSubtaskItem[]>([]);
  const [createdSubtasks, setCreatedSubtasks] = useState<
    Record<number, boolean>
  >({});

  const { mutate: breakDownTask, isPending: isGenerating } =
    useAiTaskBreakdown();
  const { mutate: createSubtask, isPending: isCreating } =
    useCreateIssueSubtask();

  const handleGenerate = () => {
    breakDownTask(
      {
        issue_title: issueTitle,
        issue_description: issueDescription || "",
      },
      {
        onSuccess: (data) => {
          setSummary(data.summary);
          setSubtasks(data.subtasks);
          setHasGenerated(true);
          setIsOpen(true);
        },
      },
    );
  };

  const handleAddSubtask = (subtask: AiSubtaskItem, index: number) => {
    createSubtask(
      {
        subdomain,
        projectSlug,
        data: {
          issue_type: "subtask",
          title: subtask.title,
          description: subtask.description,
          parent_id: Number(issueId),
          sprint_id: sprintId ?? null,
          priority: "medium",
        },
      },
      {
        onSuccess: () => {
          setCreatedSubtasks((prev) => ({ ...prev, [index]: true }));
        },
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-zinc-300 font-mono tracking-tight">
          Task Breakdown
        </span>
        <div className="flex items-center gap-2">
          {hasGenerated && (
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
                  Show Suggestions <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="h-7 px-2.5 text-xs bg-transparent hover:bg-transparent text-primary hover:text-primary/80 border border-primary/30 rounded-xs font-mono cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Analyzing...
              </>
            ) : hasGenerated ? (
              "Regenerate"
            ) : (
              "Break down with AI"
            )}
          </Button>
        </div>
      </div>

      {isOpen && hasGenerated && (
        <div className="bg-black/60 border border-primary/20 p-3 rounded-xs space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200 font-mono">
              Suggested Subtasks
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {subtasks.length} items suggested
            </span>
          </div>

          {summary && (
            <p className="text-xs text-zinc-400 italic border-l-2 border-primary pl-2">
              {summary}
            </p>
          )}

          <div className="space-y-2.5 pt-1">
            {subtasks.map((subtask, index) => {
              const isCreated = createdSubtasks[index];
              return (
                <div
                  key={index}
                  className="p-2.5 bg-black/40 border border-white/5 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 text-xs min-w-0 flex-1">
                    <span className="font-semibold text-zinc-200 block font-sans">
                      {subtask.title}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      {subtask.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isCreating || isCreated}
                    onClick={() => handleAddSubtask(subtask, index)}
                    className={`h-7 px-2.5 text-[11px] shrink-0 font-mono rounded-xs cursor-pointer ${
                      isCreated
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-200 hover:text-white"
                    }`}
                  >
                    {isCreated ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-emerald-400" />{" "}
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1 text-primary" /> Add to
                        Subtasks
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
