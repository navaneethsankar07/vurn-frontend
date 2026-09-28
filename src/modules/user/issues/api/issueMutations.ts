import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addIssueLabel,
  createIssueComment,
  createProjectIssue,
  removeIssueLabel,
  updateIssueComment,
  updateProjectIssue,
} from "./issueApi";
import type {
  AddIssueLabelParams,
  CommentItem,
  CommentReplyItem,
  CreateCommentParams,
  CreateCommentResponse,
  CreateIssueParams,
  IssueDetailResponse,
  IssueItem,
  IssueLabel,
  PaginatedCommentsResponse,
  RemoveIssueLabelParams,
  UpdateCommentParams,
  UpdateCommentResponse,
  UpdateIssueParams,
} from "../types";

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
      toast.success(data.message);
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
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
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
