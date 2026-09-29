import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addIssueLabel,
  completeAttachmentUpload,
  createIssueComment,
  createProjectIssue,
  deleteCommentReaction,
  deleteIssueComment,
  deleteProjectIssue,
  initializeAttachmentUpload,
  removeIssueLabel,
  setCommentReaction,
  updateIssueComment,
  updateProjectIssue,
} from "./issueApi";
import type {
  AddIssueLabelParams,
  CommentItem,
  CommentReactionSummary,
  CommentReplyItem,
  CreateCommentParams,
  CreateCommentResponse,
  CreateIssueParams,
  DeleteCommentParams,
  DeleteCommentResponse,
  DeleteIssueParams,
  DeleteIssueResponse,
  DeleteReactionResponse,
  IssueDetailResponse,
  IssueItem,
  IssueLabel,
  PaginatedCommentsResponse,
  ReactionParams,
  RemoveIssueLabelParams,
  SetReactionParams,
  SetReactionResponse,
  SubtaskItem,
  SubtaskListResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
  UpdateIssueParams,
} from "../types";
import { uploadFileToS3 } from "@/utils/uploadToS3";

export function useCreateProjectIssue() {
  const queryClient = useQueryClient();

  return useMutation<IssueItem, any, CreateIssueParams>({
    mutationFn: createProjectIssue,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["kanban-board", variables.subdomain, variables.projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "project-sprints",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      toast.success(data?.message || "Work item created successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.title?.[0] ||
        "Failed to create work item.";
      toast.error(message);
    },
  });
}

export function useCreateIssueSubtask() {
  const queryClient = useQueryClient();

  return useMutation<any, any, CreateIssueParams>({
    mutationFn: createProjectIssue,
    onSuccess: (response, variables) => {
      const createdItem: SubtaskItem = response?.issue ?? response;

      queryClient.setQueriesData<InfiniteData<SubtaskListResponse>>(
        {
          queryKey: [
            "issue-subtasks",
            variables.subdomain,
            variables.projectSlug,
            String(variables.data.parent_id),
          ],
        },
        (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  count: 1,
                  next: null,
                  previous: null,
                  results: [createdItem],
                },
              ],
              pageParams: [1],
            };
          }

          const updatedPages = oldData.pages.map((page, index) => {
            const newCount = (page.count || 0) + 1;

            if (index === oldData.pages.length - 1) {
              return {
                ...page,
                count: newCount,
                results: [...page.results, createdItem],
              };
            }

            return {
              ...page,
              count: newCount,
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: [
          "issue-subtasks",
          variables.subdomain,
          variables.projectSlug,
          String(variables.data.parent_id),
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "project-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["kanban-board", variables.subdomain, variables.projectSlug],
      });

      toast.success(response?.message || "Subtask created successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.title?.[0] ||
        "Failed to create subtask.";
      toast.error(message);
    },
  });
}

export function useUpdateProjectIssue() {
  const queryClient = useQueryClient();

  return useMutation<IssueDetailResponse, any, UpdateIssueParams>({
    mutationFn: updateProjectIssue,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [
          "project-issue-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
        data,
      );
      queryClient.invalidateQueries({
        queryKey: [
          "project-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["kanban-board", variables.subdomain, variables.projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "issue-subtasks",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update issue.";
      toast.error(message);
    },
  });
}

export function useAddIssueLabel() {
  const queryClient = useQueryClient();

  return useMutation<IssueLabel, any, AddIssueLabelParams>({
    mutationFn: addIssueLabel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-issue-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "issue-label-suggestions",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
    },
  });
}

export function useRemoveIssueLabel() {
  const queryClient = useQueryClient();

  return useMutation<void, any, RemoveIssueLabelParams>({
    mutationFn: removeIssueLabel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-issue-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });
    },
  });
}

export function useCreateIssueComment() {
  const queryClient = useQueryClient();

  return useMutation<CreateCommentResponse, any, CreateCommentParams>({
    mutationFn: createIssueComment,
    onSuccess: (res, variables) => {
      const newCommentRaw = res.comment;
      const isReply = Boolean(newCommentRaw.parent_id);

      const newCommentItem: CommentItem = {
        ...newCommentRaw,
        replies: [],
      };

      queryClient.setQueriesData<InfiniteData<PaginatedCommentsResponse>>(
        {
          queryKey: [
            "issue-comments",
            variables.subdomain,
            variables.projectSlug,
            String(variables.issueId),
          ],
        },
        (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const updatedPages = oldData.pages.map((page, index) => {
            const currentCount = (page.count || 0) + (isReply ? 0 : 1);

            if (isReply) {
              const updatedResults = page.results.map((comment) => {
                if (Number(comment.id) === Number(newCommentRaw.parent_id)) {
                  const currentReplies = Array.isArray(comment.replies)
                    ? comment.replies
                    : [];

                  return {
                    ...comment,
                    replies: [...currentReplies, newCommentItem],
                  };
                }
                return comment;
              });

              return {
                ...page,
                results: updatedResults,
              };
            }

            if (index === 0) {
              return {
                ...page,
                count: currentCount,
                results: [newCommentItem, ...page.results],
              };
            }

            return {
              ...page,
              count: currentCount,
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );

      toast.success(res.message || "Comment added successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.content?.[0] ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to post comment.";
      toast.error(message);
    },
  });
}

export function useUpdateIssueComment() {
  const queryClient = useQueryClient();

  return useMutation<UpdateCommentResponse, any, UpdateCommentParams>({
    mutationFn: updateIssueComment,
    onSuccess: (res, variables) => {
      queryClient.setQueriesData<InfiniteData<PaginatedCommentsResponse>>(
        {
          queryKey: [
            "issue-comments",
            variables.subdomain,
            variables.projectSlug,
            String(variables.issueId),
          ],
        },
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedCommentId = Number(variables.commentId);

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((comment: CommentItem) => {
              if (comment.id === updatedCommentId) {
                return {
                  ...comment,
                  content: res.content,
                  updated_at: res.updated_at,
                };
              }

              if (
                Array.isArray(comment.replies) &&
                comment.replies.length > 0
              ) {
                const hasTargetReply = comment.replies.some(
                  (r) => r.id === updatedCommentId,
                );
                if (hasTargetReply) {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply: CommentReplyItem) => {
                      if (reply.id === updatedCommentId) {
                        return {
                          ...reply,
                          content: res.content,
                          updated_at: res.updated_at,
                        };
                      }
                      return reply;
                    }),
                  };
                }
              }

              return comment;
            }),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );

      toast.success(res.message || "Comment updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.content?.[0] ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update comment.";
      toast.error(message);
    },
  });
}

export function useDeleteIssueComment() {
  const queryClient = useQueryClient();

  return useMutation<DeleteCommentResponse, any, DeleteCommentParams>({
    mutationFn: deleteIssueComment,
    onSuccess: (res, variables) => {
      const targetId = Number(variables.commentId);

      queryClient.setQueriesData<InfiniteData<PaginatedCommentsResponse>>(
        {
          queryKey: [
            "issue-comments",
            variables.subdomain,
            variables.projectSlug,
            String(variables.issueId),
          ],
        },
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          let removedTopLevel = false;

          const updatedPages = oldData.pages.map((page) => {
            const hasTopLevelTarget = page.results.some(
              (c) => c.id === targetId,
            );

            if (hasTopLevelTarget) {
              removedTopLevel = true;
              return {
                ...page,
                results: page.results.filter((c) => c.id !== targetId),
              };
            }

            const updatedResults = page.results.map((c: CommentItem) => {
              if (
                Array.isArray(c.replies) &&
                c.replies.some((r) => r.id === targetId)
              ) {
                return {
                  ...c,
                  replies: c.replies.filter((r) => r.id !== targetId),
                };
              }
              return c;
            });

            return {
              ...page,
              results: updatedResults,
            };
          });

          const finalPages = updatedPages.map((page) => ({
            ...page,
            count: removedTopLevel
              ? Math.max(0, (page.count || 0) - 1)
              : page.count,
          }));

          return {
            ...oldData,
            pages: finalPages,
          };
        },
      );

      toast.success(res?.message || "Comment deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to delete comment.";
      toast.error(message);
    },
  });
}

export function useSetCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation<SetReactionResponse, any, SetReactionParams>({
    mutationFn: setCommentReaction,
    onSuccess: (res, variables) => {
      const reactionData: CommentReactionSummary =
        (res as any)?.reaction ?? res;

      queryClient.setQueryData(
        [
          "comment-reactions",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
          String(variables.commentId),
        ],
        reactionData,
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update reaction.";
      toast.error(message);
    },
  });
}

export function useDeleteCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation<DeleteReactionResponse, any, ReactionParams>({
    mutationFn: deleteCommentReaction,
    onSuccess: (res, variables) => {
      const queryKey = [
        "comment-reactions",
        variables.subdomain,
        variables.projectSlug,
        String(variables.issueId),
        String(variables.commentId),
      ];

      if (res?.reaction) {
        queryClient.setQueryData(queryKey, res.reaction);
      } else {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useDeleteProjectIssue() {
  const queryClient = useQueryClient();

  return useMutation<DeleteIssueResponse, any, DeleteIssueParams>({
    mutationFn: deleteProjectIssue,
    onSuccess: (data, variables) => {
      queryClient.removeQueries({
        queryKey: [
          "project-issue-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "project-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["kanban-board", variables.subdomain, variables.projectSlug],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "issue-subtasks",
          variables.subdomain,
          variables.projectSlug,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "project-sprints",
          variables.subdomain,
          variables.projectSlug,
        ],
      });

      toast.success(data?.message || "Issue deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to delete issue.";
      toast.error(message);
    },
  });
}

interface UploadWorkflowParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  file: File;
  onProgress?: (progress: number) => void;
}

export function useAttachmentUploadWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<void, any, UploadWorkflowParams>({
    mutationFn: async ({
      subdomain,
      projectSlug,
      issueId,
      file,
      onProgress,
    }) => {
      const initRes = await initializeAttachmentUpload({
        subdomain,
        projectSlug,
        issueId,
        data: {
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        },
      });

      await uploadFileToS3({
        uploadUrl: initRes.upload_url,
        file,
        onProgress,
      });

      await completeAttachmentUpload({
        subdomain,
        projectSlug,
        issueId,
        data: {
          object_key: initRes.object_key,
        },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "issue-attachments",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });
      toast.success("Attachment uploaded successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to upload attachment.";
      toast.error(message);
    },
  });
}
