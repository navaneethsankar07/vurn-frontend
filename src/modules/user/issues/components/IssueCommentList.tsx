import { useState } from "react";
import { MessageSquare, CornerDownRight, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateIssueComment } from "../api/issueMutations";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { CommentItem, CommentReplyItem } from "../types";

interface IssueCommentListProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  comments: CommentItem[];
  isLoading: boolean;
}

export function IssueCommentList({
  subdomain,
  projectSlug,
  issueId,
  comments,
  isLoading,
}: IssueCommentListProps) {
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { mutate: createComment, isPending } = useCreateIssueComment();

  const safeComments = Array.isArray(comments)
    ? comments
    : Array.isArray((comments as any)?.results)
      ? (comments as any).results
      : [];

  const handleOpenReply = (commentId: number) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
      setReplyText("");
    } else {
      setActiveReplyId(commentId);
      setReplyText("");
    }
  };

  const handleCloseReply = () => {
    setActiveReplyId(null);
    setReplyText("");
  };

  const handleSubmitReply = (parentId: number) => {
    const trimmed = replyText.trim();
    if (!trimmed || isPending) return;

    createComment(
      {
        subdomain,
        projectSlug,
        issueId,
        data: {
          content: trimmed,
          parent_id: parentId,
        },
      },
      {
        onSuccess: () => {
          handleCloseReply();
        },
      },
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    parentId: number,
  ) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitReply(parentId);
    }
  };

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
                  onClick={() => handleOpenReply(comment.id)}
                  className={`flex items-center gap-1 text-[11px] transition-colors py-0.5 ${
                    activeReplyId === comment.id
                      ? "text-amber-500 font-semibold"
                      : "text-zinc-500 hover:text-amber-500"
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>

          {activeReplyId === comment.id && (
            <div className="pl-6 border-l border-amber-500/30 ml-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, comment.id)}
                placeholder={`Reply to ${comment.author_name}... (Ctrl+Enter to post)`}
                rows={2}
                autoFocus
                className="bg-black border-white/10 text-white rounded-xs text-xs font-sans placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-amber-500 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseReply}
                  className="h-6 px-2 text-[11px] border-white/10 bg-transparent text-zinc-400 hover:text-white rounded-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!replyText.trim() || isPending}
                  onClick={() => handleSubmitReply(comment.id)}
                  className="h-6 px-2.5 bg-amber-500 text-black hover:bg-amber-400 text-[11px] font-semibold rounded-xs gap-1 transition-colors"
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                  <span>Reply</span>
                </Button>
              </div>
            </div>
          )}

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
