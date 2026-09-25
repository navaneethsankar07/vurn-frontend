import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  X,
  MoreHorizontal,
  Pencil,
  Send,
  Paperclip,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProjectIssueDetail } from "../api/issueQueries";
import { WORK_ITEM_TYPES } from "../constants";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface IssueDetailPanelProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  onClose: () => void;
}

export function IssueDetailPanel({
  subdomain,
  projectSlug,
  issueId,
  onClose,
}: IssueDetailPanelProps) {
  const [commentText, setCommentText] = useState("");

  const {
    data: issue,
    isLoading,
    isError,
  } = useProjectIssueDetail(subdomain, projectSlug, issueId);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex items-center justify-center font-mono text-xs text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Loading item details...
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 p-6 font-mono text-xs text-red-400 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Error</span>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1 rounded-xs"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p>Failed to load work item details.</p>
        </div>
      </div>
    );
  }

  const typeConfig =
    WORK_ITEM_TYPES.find((t) => t.value === issue.issue_type) ??
    WORK_ITEM_TYPES[2];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex flex-col font-mono text-white text-xs select-none">
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: typeConfig.color }}
          />
          <span className="font-semibold text-amber-500">{issue.key}</span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[10px] text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {issue.status_name || "Status"}
          </span>
          {issue.story_points !== null && (
            <span className="bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded-xs text-zinc-300">
              {issue.story_points} pt
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-zinc-500">
          <button
            type="button"
            className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 font-sans leading-snug">
            {issue.title}
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Description
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white transition-colors"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-zinc-300 font-sans text-xs leading-relaxed bg-black/40 p-3 rounded-xs border border-white/5 whitespace-pre-wrap">
            {issue.description ? (
              <ReactMarkdown>{issue.description}</ReactMarkdown>
            ) : (
              <span className="text-zinc-600 italic">
                No description provided.
              </span>
            )}
          </div>
        </div>

        {/* <div className="border border-amber-500/20 bg-amber-500/5 rounded-xs p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-500 text-[11px] font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Assistance</span>
            </div>
            <span className="text-[10px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded-xs">
              ✦ 5 AI Credits
            </span>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              className="w-full h-7 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-semibold rounded-xs justify-center gap-1.5"
            >
              # Break into Tasks
            </Button>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-zinc-400 font-semibold block">
                Suggested Implementation Tasks
              </span>
              <div className="space-y-1 text-zinc-300 font-sans text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Design authentication flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Create login REST API</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Token rotation policy enforcement</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-500/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 bg-amber-500 text-black hover:bg-amber-400 text-[10px] font-semibold rounded-xs transition-colors"
                >
                  Insert as Checklist
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] rounded-xs flex items-center gap-1 transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy Markdown</span>
                </button>
              </div>
              <button
                type="button"
                className="text-zinc-500 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
              >
                <RotateCw className="h-3 w-3" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div> */}

        <div className="space-y-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Information
          </span>
          <div className="divide-y divide-white/5 border border-white/5 bg-black/40 rounded-xs">
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="text-zinc-200">{issue.status_name}</span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Priority</span>
              <span className="text-zinc-200 capitalize">{issue.priority}</span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Assignee</span>
              <span className="text-zinc-200">
                {issue.assignee_name || "Unassigned"}
              </span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Reporter</span>
              <span className="text-zinc-200">
                {issue.reporter_name || "System"}
              </span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Sprint</span>
              <span className="text-zinc-200">
                {issue.sprint_name || "Backlog"}
              </span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Story Points</span>
              <span className="text-zinc-200">{issue.story_points ?? "—"}</span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Created</span>
              <span className="text-zinc-200">
                {formatRelativeTime(issue.created_at)}
              </span>
            </div>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Last Updated</span>
              <span className="text-zinc-200">
                {formatRelativeTime(issue.updated_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Labels
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[10px] text-zinc-400">
              security
            </span>
            <span className="px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[10px] text-zinc-400">
              tokens
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Activity
          </span>
          <div className="space-y-2 text-[11px] text-zinc-400 font-sans">
            <div className="flex items-center justify-between">
              <span>Issue created</span>
              <span className="text-[10px] font-mono text-zinc-600">
                {formatRelativeTime(issue.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status updated to {issue.status_name}</span>
              <span className="text-[10px] font-mono text-zinc-600">
                {formatRelativeTime(issue.updated_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Comments
          </span>
          <div className="space-y-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="bg-black border-white/10 text-white rounded-xs text-xs font-sans placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-amber-500 resize-none"
            />
            <div className="flex items-center justify-end">
              <Button
                type="button"
                disabled={!commentText.trim()}
                className="h-7 bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold rounded-xs gap-1.5 px-3"
              >
                <Send className="h-3 w-3" />
                <span>Comment</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Attachments
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
            >
              <Paperclip className="h-3 w-3" />
              <span>Attach</span>
            </button>
          </div>
          <div className="p-3 border border-dashed border-white/10 rounded-xs text-center text-zinc-600 text-[11px] font-sans">
            No files attached yet.
          </div>
        </div>
      </div>
    </div>
  );
}
