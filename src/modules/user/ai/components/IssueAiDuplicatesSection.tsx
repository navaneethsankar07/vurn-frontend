import { useState } from "react";
import {
  CopyCheck,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiDetectDuplicates } from "../api/aiMutations";
import type { DuplicateIssueItem } from "../types";
import { getSubdomain } from "@/utils/subdomain";

interface IssueAiDuplicatesSectionProps {
  projectSlug: string;
  title: string;
  description?: string;
  issueType: string;
  priority: string;
}

export function IssueAiDuplicatesSection({
  projectSlug,
  title,
  description,
  issueType,
  priority,
}: IssueAiDuplicatesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateIssueItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: detectDuplicates, isPending } = useAiDetectDuplicates();

  const handleCheckDuplicates = () => {
    if (!title.trim()) {
      setErrorMessage(
        "Please enter an issue title before checking duplicates.",
      );
      return;
    }
    setErrorMessage(null);

    const orgSlug = getSubdomain() || "default";

    detectDuplicates(
      {
        organization_slug: orgSlug,
        project_slug: projectSlug,
        title: title.trim(),
        description: description?.trim() || "",
        issue_type: issueType,
        priority: priority,
      },
      {
        onSuccess: (data) => {
          setDuplicates(data.duplicates || []);
          setHasChecked(true);
          setIsOpen(true);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.error ||
            error?.response?.data?.detail ||
            "Failed to check duplicate issues.";
          setErrorMessage(msg);
        },
      },
    );
  };

  const getConfidenceBadgeColor = (confidence?: string) => {
    switch (confidence) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-white/10 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 tracking-tight">
          <CopyCheck className="h-3.5 w-3.5 text-primary" /> Duplicate Check
        </div>
        <div className="flex items-center gap-2">
          {hasChecked && (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              {isOpen ? (
                <>
                  Hide <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show Results <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
          <Button
            type="button"
            onClick={handleCheckDuplicates}
            disabled={isPending}
            className="h-7 px-2.5 text-xs bg-transparent hover:bg-transparent text-primary hover:text-primary/80 border border-primary/30 rounded-xs font-mono cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Checking...
              </>
            ) : hasChecked ? (
              "Re-check Duplicates"
            ) : (
              "Check Duplicate Issues"
            )}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-[11px] text-red-400 font-sans">{errorMessage}</p>
      )}

      {isOpen && hasChecked && (
        <div className="bg-black/60 border border-primary/20 p-3 rounded-xs space-y-3 font-sans">
          {duplicates.length === 0 ? (
            <p className="text-xs text-zinc-400 italic font-mono py-1">
              No likely duplicate issues found.
            </p>
          ) : (
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
                Found {duplicates.length} potential duplicate(s):
              </span>
              {duplicates.map((dup) => (
                <div
                  key={dup.issue_id}
                  className="p-2.5 bg-black/40 border border-white/5 rounded-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={`/projects/${projectSlug}/issues/${dup.issue_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:underline font-mono"
                    >
                      <span>
                        {dup.key}: {dup.title}
                      </span>
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </a>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded border uppercase font-mono ${getConfidenceBadgeColor(
                        dup.confidence,
                      )}`}
                    >
                      {dup.confidence} confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                    {dup.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
