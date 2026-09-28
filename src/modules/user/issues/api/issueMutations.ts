import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addIssueLabel,
  createIssueComment,
  createProjectIssue,
  removeIssueLabel,
  updateProjectIssue,
} from "./issueApi";
import type {
  AddIssueLabelParams,
  CommentItem,
  CreateCommentParams,
  CreateIssueParams,
  IssueDetailResponse,
  IssueItem,
  IssueLabel,
  RemoveIssueLabelParams,
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

  return useMutation<CommentItem, any, CreateCommentParams>({
    mutationFn: createIssueComment,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "issue-comments",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "project-issue-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.issueId),
        ],
      });
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
