import { MessageSquare, CornerDownRight, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { CommentItem, CommentReplyItem } from "../types";

interface IssueCommentListProps {
  comments: CommentItem[];
  isLoading: boolean;
  onReplyClick?: (commentId: number, authorName: string) => void;
}

export function IssueCommentList({
  comments,
  isLoading,
  onReplyClick,
}: IssueCommentListProps) {
  const safeComments = Array.isArray(comments)
    ? comments
    : Array.isArray((comments as any)?.results)
      ? (comments as any).results
      : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6 text-zinc-500 text-xs">
        <Loader2 className="h-4 w-4 animate-spin mr-2 text-amber-500" />
        <span>Loading discussion...</span>
      </div>
    );
  }

  if (safeComments.length === 0) {
    return (
      <div className="text-center py-5 border border-dashed border-white/5 rounded-xs text-zinc-600 text-[11px] font-sans">
        No comments yet. Start the conversation above.
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1">
      {safeComments.map((comment: CommentItem) => (
        <div key={comment.id} className="space-y-2.5">
          <div className="bg-black/50 border border-white/5 p-3 rounded-xs space-y-1.5 transition-colors hover:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold flex items-center justify-center">
                  {comment.author_name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="font-semibold text-zinc-200 text-xs font-sans">
                  {comment.author_name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                {formatRelativeTime(comment.created_at, "")}
              </span>
            </div>

            <p className="text-zinc-300 font-sans text-xs leading-relaxed whitespace-pre-wrap pl-7">
              {comment.content}
            </p>

            <div className="flex items-center justify-between pt-1.5 pl-7">
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    onReplyClick?.(comment.id, comment.author_name)
                  }
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-amber-500 transition-colors py-0.5"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>

          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="pl-6 space-y-2 border-l border-white/10 ml-3">
              {comment.replies.map((reply: CommentReplyItem) => (
                <div
                  key={reply.id}
                  className="bg-black/30 border border-white/5 p-2.5 rounded-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="h-3 w-3 text-zinc-600 shrink-0" />
                      <span className="h-4 w-4 rounded-full bg-white/5 text-zinc-300 text-[9px] font-semibold flex items-center justify-center">
                        {reply.author_name?.[0]?.toUpperCase() || "U"}
                      </span>
                      <span className="font-semibold text-zinc-300 text-[11px] font-sans">
                        {reply.author_name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formatRelativeTime(reply.created_at, "")}
                    </span>
                  </div>

                  <p className="text-zinc-300 font-sans text-xs leading-relaxed whitespace-pre-wrap pl-5">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
