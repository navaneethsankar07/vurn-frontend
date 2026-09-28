import { useState } from "react";
import {
  MessageSquare,
  CornerDownRight,
  Loader2,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModal";
import {
  useCreateIssueComment,
  useDeleteIssueComment,
} from "../api/issueMutations";
import { formatRelativeTime, isCommentEdited } from "@/utils/sprintHelpers";
import { IssueCommentEditForm } from "./IssueCommentEditForm";
import { DeleteCommentModal } from "./modals/DeleteCommentModal";
import { CommentReactions } from "./CommentReactions";
import type { CommentItem, CommentReplyItem } from "../types";

interface IssueCommentListProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  comments: CommentItem[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
  totalCount?: number;
}

const REPLIES_PAGE_SIZE = 5;

export function IssueCommentList({
  subdomain,
  projectSlug,
  issueId,
  comments,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  totalCount = 0,
}: IssueCommentListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?.id;

  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const deleteModal = useModal();

  const [expandedReplies, setExpandedReplies] = useState<
    Record<number, boolean>
  >({});
  const [visibleRepliesCount, setVisibleRepliesCount] = useState<
    Record<number, number>
  >({});

  const { mutate: createComment, isPending: isCreatingReply } =
    useCreateIssueComment();
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteIssueComment();

  const handleOpenReply = (commentId: number) => {
    setEditingCommentId(null);
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

  const handleToggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => {
      const willExpand = !prev[commentId];
      if (willExpand && !visibleRepliesCount[commentId]) {
        setVisibleRepliesCount((counts) => ({
          ...counts,
          [commentId]: REPLIES_PAGE_SIZE,
        }));
      }
      return {
        ...prev,
        [commentId]: willExpand,
      };
    });
  };

  const handleShowMoreReplies = (commentId: number) => {
    setVisibleRepliesCount((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || REPLIES_PAGE_SIZE) + REPLIES_PAGE_SIZE,
    }));
  };

  const handleSubmitReply = (parentId: number) => {
    const trimmed = replyText.trim();
    if (!trimmed || isCreatingReply) return;

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
          setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
          setVisibleRepliesCount((prev) => ({
            ...prev,
            [parentId]: Math.max(
              prev[parentId] || REPLIES_PAGE_SIZE,
              REPLIES_PAGE_SIZE,
            ),
          }));
        },
      },
    );
  };

  const handlePromptDelete = (commentId: number, isReply = false) => {
    setTargetDeleteId(commentId);
    setIsDeletingReply(isReply);
    deleteModal.openModal();
  };

  const handleConfirmDelete = () => {
    if (!targetDeleteId || isDeletingComment) return;

    deleteComment(
      {
        subdomain,
        projectSlug,
        issueId,
        commentId: targetDeleteId,
      },
      {
        onSuccess: () => {
          deleteModal.closeModal();
          setTargetDeleteId(null);
          if (editingCommentId === targetDeleteId) {
            setEditingCommentId(null);
          }
          if (activeReplyId === targetDeleteId) {
            setActiveReplyId(null);
          }
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

  if (comments.length === 0) {
    return (
      <div className="text-center py-5 border border-dashed border-white/5 rounded-xs text-zinc-600 text-[11px] font-sans">
        No comments yet. Start the conversation below.
      </div>
    );
  }

  const remainingComments = Math.max(0, totalCount - comments.length);

  return (
    <div className="space-y-4 pt-1">
      {comments.map((comment: CommentItem) => {
        const totalReplies = Array.isArray(comment.replies)
          ? comment.replies.length
          : 0;
        const isRepliesOpen = Boolean(expandedReplies[comment.id]);
        const currentReplyLimit =
          visibleRepliesCount[comment.id] || REPLIES_PAGE_SIZE;
        const displayedReplies = Array.isArray(comment.replies)
          ? comment.replies.slice(0, currentReplyLimit)
          : [];
        const hasMoreReplies = totalReplies > currentReplyLimit;
        const isCommentAuthor =
          currentUserId && comment.author_id === currentUserId;
        const isEditingThisComment = editingCommentId === comment.id;

        return (
          <div key={comment.id} className="space-y-2.5">
            <div className="bg-black/50 border border-white/5 p-3 rounded-xs space-y-1.5 transition-colors hover:border-white/10 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {comment.author_profile ? (
                    <img
                      src={comment.author_profile}
                      alt={comment.author_name}
                      className="h-5 w-5 rounded-full object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <span className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {comment.author_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="font-semibold text-zinc-200 text-xs font-sans">
                    {comment.author_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">
                    {formatRelativeTime(comment.created_at, "")}
                  </span>
                  {isCommentEdited(comment.created_at, comment.updated_at) && (
                    <span className="text-[9px] font-mono text-zinc-600">
                      (edited)
                    </span>
                  )}
                </div>
              </div>

              {isEditingThisComment ? (
                <div className="pl-7">
                  <IssueCommentEditForm
                    subdomain={subdomain}
                    projectSlug={projectSlug}
                    issueId={issueId}
                    commentId={comment.id}
                    initialContent={comment.content}
                    onCancel={() => setEditingCommentId(null)}
                  />
                </div>
              ) : (
                <p className="text-zinc-300 font-sans text-xs leading-relaxed whitespace-pre-wrap pl-7">
                  {comment.content}
                </p>
              )}

              <div className="flex items-center justify-between pt-1.5 pl-7">
                <div className="flex items-center gap-3 text-[11px]">
                  <CommentReactions
                    subdomain={subdomain}
                    projectSlug={projectSlug}
                    issueId={issueId}
                    commentId={comment.id}
                  />

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

                  {isCommentAuthor && !isEditingThisComment && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(null);
                          setEditingCommentId(comment.id);
                        }}
                        className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white transition-colors py-0.5"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePromptDelete(comment.id, false)}
                        className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition-colors py-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}

                  {totalReplies > 0 && (
                    <button
                      type="button"
                      onClick={() => handleToggleReplies(comment.id)}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors py-0.5"
                    >
                      {isRepliesOpen ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          <span>Hide replies</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          <span>
                            Show {totalReplies}{" "}
                            {totalReplies === 1 ? "reply" : "replies"}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {targetDeleteId === comment.id && !isDeletingReply && (
                <div className="pl-7 pt-1">
                  <DeleteCommentModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => {
                      deleteModal.closeModal();
                      setTargetDeleteId(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    isPending={isDeletingComment}
                    isReply={false}
                    hasReplies={totalReplies > 0}
                  />
                </div>
              )}
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
                    disabled={!replyText.trim() || isCreatingReply}
                    onClick={() => handleSubmitReply(comment.id)}
                    className="h-6 px-2.5 bg-amber-500 text-black hover:bg-amber-400 text-[11px] font-semibold rounded-xs gap-1 transition-colors"
                  >
                    {isCreatingReply ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                    <span>Reply</span>
                  </Button>
                </div>
              </div>
            )}

            {isRepliesOpen && totalReplies > 0 && (
              <div className="pl-6 space-y-2 border-l border-white/10 ml-3">
                {displayedReplies.map((reply: CommentReplyItem) => {
                  const isReplyAuthor =
                    currentUserId && reply.author_id === currentUserId;
                  const isEditingThisReply = editingCommentId === reply.id;

                  return (
                    <div
                      key={reply.id}
                      className="bg-black/30 border border-white/5 p-2.5 rounded-xs space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CornerDownRight className="h-3 w-3 text-zinc-600 shrink-0" />
                          {reply.author_profile ? (
                            <img
                              src={reply.author_profile}
                              alt={reply.author_name}
                              className="h-4 w-4 rounded-full object-cover border border-white/10 shrink-0"
                            />
                          ) : (
                            <span className="h-4 w-4 rounded-full bg-white/5 text-zinc-300 text-[9px] font-semibold flex items-center justify-center shrink-0">
                              {reply.author_name?.[0]?.toUpperCase() || "U"}
                            </span>
                          )}
                          <span className="font-semibold text-zinc-300 text-[11px] font-sans">
                            {reply.author_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500">
                            {formatRelativeTime(reply.created_at, "")}
                          </span>
                          {isCommentEdited(
                            reply.created_at,
                            reply.updated_at,
                          ) && (
                            <span className="text-[9px] font-mono text-zinc-600">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>

                      {isEditingThisReply ? (
                        <div className="pl-5">
                          <IssueCommentEditForm
                            subdomain={subdomain}
                            projectSlug={projectSlug}
                            issueId={issueId}
                            commentId={reply.id}
                            initialContent={reply.content}
                            onCancel={() => setEditingCommentId(null)}
                          />
                        </div>
                      ) : (
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed whitespace-pre-wrap pl-5">
                          {reply.content}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pl-5 pt-0.5">
                        <CommentReactions
                          subdomain={subdomain}
                          projectSlug={projectSlug}
                          issueId={issueId}
                          commentId={reply.id}
                        />

                        {isReplyAuthor && !isEditingThisReply && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyId(null);
                                setEditingCommentId(reply.id);
                              }}
                              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-white transition-colors"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromptDelete(reply.id, true)}
                              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>

                      {targetDeleteId === reply.id && isDeletingReply && (
                        <div className="pl-5 pt-1">
                          <DeleteCommentModal
                            isOpen={deleteModal.isOpen}
                            onClose={() => {
                              deleteModal.closeModal();
                              setTargetDeleteId(null);
                            }}
                            onConfirm={handleConfirmDelete}
                            isPending={isDeletingComment}
                            isReply={true}
                            hasReplies={false}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex items-center gap-3 pt-1">
                  {hasMoreReplies && (
                    <button
                      type="button"
                      onClick={() => handleShowMoreReplies(comment.id)}
                      className="text-[11px] text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                      Show more replies ({totalReplies - currentReplyLimit}{" "}
                      remaining)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleReplies(comment.id)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Hide replies
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {hasNextPage && (
        <div className="pt-2 text-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => onFetchNextPage?.()}
            className="h-7 text-xs border-white/10 bg-black/40 hover:bg-white/5 text-zinc-300 hover:text-white rounded-xs gap-1.5"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : null}
            <span>
              Show more comments{" "}
              {remainingComments > 0 ? `(${remainingComments} remaining)` : ""}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
