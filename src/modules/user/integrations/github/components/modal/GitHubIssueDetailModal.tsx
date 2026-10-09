import { ExternalLink, Calendar, User, Clock, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatRelativeTime } from "@/utils/date";
import type { GitHubIssueItem } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateVurnIssueDropdown } from "../CreateVurnIssueDropdown";

interface GitHubIssueDetailModalProps {
  issue: GitHubIssueItem;
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubIssueDetailModal({
  issue,
  isOpen,
  onClose,
}: GitHubIssueDetailModalProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(parseISO(dateStr), "MMM d, yyyy HH:mm");
    } catch {
      return dateStr;
    }
  };

  const isOpenState = issue.state === "open";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-2xl rounded-xs shadow-2xl p-6 space-y-6 [&>button]:rounded-xs [&>button]:top-5 [&>button]:right-5">
        <DialogHeader className="space-y-2 border-b border-white/5 pb-4 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-xs">
              #{issue.issue_number}
            </span>
            <span
              className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-semibold border ${
                isOpenState
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-purple-500/30 bg-purple-500/10 text-purple-400"
              }`}
            >
              {issue.state}
            </span>
          </div>
          <DialogTitle className="text-base font-bold text-white font-sans text-left leading-snug">
            {issue.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-2 bg-black/40 p-4 rounded-xs border border-white/10">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Description
            </span>
            <p className="text-zinc-300 font-sans whitespace-pre-wrap text-xs leading-relaxed">
              {issue.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xs border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                <User className="h-3 w-3 text-amber-500" />
                Author
              </span>
              <p className="text-xs font-bold text-white pt-0.5 truncate">
                {issue.author_username}
              </p>
            </div>

            <div className="p-3.5 rounded-xs border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                <Clock className="h-3 w-3 text-amber-500" />
                Updated At
              </span>
              <p className="text-xs font-bold text-white pt-0.5 truncate">
                {formatRelativeTime(issue.updated_at)}
              </p>
            </div>

            <div className="p-3.5 rounded-xs border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                <Calendar className="h-3 w-3 text-amber-500" />
                Opened At
              </span>
              <p className="text-xs font-bold text-white pt-0.5">
                {formatDate(issue.opened_at || issue.created_at)}
              </p>
            </div>

            {issue.closed_at && (
              <div className="p-3.5 rounded-xs border border-white/10 bg-black/40 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  Closed At
                </span>
                <p className="text-xs font-bold text-white pt-0.5">
                  {formatDate(issue.closed_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <CreateVurnIssueDropdown issue={issue} />

          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
          >
            <span>View on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
