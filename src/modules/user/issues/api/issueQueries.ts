import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchCommentReactions,
  fetchIssueAttachments,
  fetchIssueComments,
  fetchIssueSubtasks,
  fetchLabelSuggestions,
  fetchProjectIssueDetail,
  fetchProjectIssues,
} from "./issueApi";
import type {
  AttachmentListResponse,
  CommentReactionSummary,
  GetIssueCommentsParams,
  IssueDetailResponse,
  IssueListParams,
  IssueListResponse,
  LabelQueryParams,
  PaginatedCommentsResponse,
  ReactionParams,
  SubtaskListParams,
  SubtaskListResponse,
} from "../types";

export function useProjectIssues(
  subdomain: string,
  projectSlug: string,
  params?: IssueListParams,
) {
  return useQuery<IssueListResponse>({
    queryKey: ["project-issues", subdomain, projectSlug, params],
    queryFn: () => fetchProjectIssues(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useProjectIssueDetail(
  subdomain: string,
  projectSlug: string,
  issueId: number | string | null,
) {
  return useQuery<IssueDetailResponse>({
    queryKey: ["project-issue-detail", subdomain, projectSlug, String(issueId)],
    queryFn: () =>
      fetchProjectIssueDetail({
        subdomain,
        projectSlug,
        issueId: issueId as number | string,
      }),
    enabled: Boolean(subdomain && projectSlug && issueId),
  });
}

export function useLabelSuggestions(
  subdomain: string,
  projectSlug: string,
  params?: LabelQueryParams,
) {
  return useQuery({
    queryKey: ["issue-label-suggestions", subdomain, projectSlug, params],
    queryFn: () => fetchLabelSuggestions(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useIssueComments({
  subdomain,
  projectSlug,
  issueId,
  sort = "newest",
}: Omit<GetIssueCommentsParams, "page">) {
  return useInfiniteQuery<PaginatedCommentsResponse>({
    queryKey: ["issue-comments", subdomain, projectSlug, String(issueId), sort],
    queryFn: ({ pageParam = 1 }) =>
      fetchIssueComments({
        subdomain,
        projectSlug,
        issueId,
        page: pageParam as number,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get("page");
        return nextPage ? Number(nextPage) : undefined;
      } catch {
        return undefined;
      }
    },
    enabled: Boolean(subdomain && projectSlug && issueId),
  });
}

export function useCommentReactions({
  subdomain,
  projectSlug,
  issueId,
  commentId,
}: ReactionParams) {
  return useQuery<CommentReactionSummary>({
    queryKey: [
      "comment-reactions",
      subdomain,
      projectSlug,
      String(issueId),
      String(commentId),
    ],
    queryFn: () =>
      fetchCommentReactions({
        subdomain,
        projectSlug,
        issueId,
        commentId,
      }),
    enabled: Boolean(subdomain && projectSlug && issueId && commentId),
  });
}

interface UseIssueSubtasksOptions {
  subdomain: string;
  projectSlug: string;
  issueId: number | string | null;
  params?: SubtaskListParams;
  enabled?: boolean;
}

export function useIssueSubtasks({
  subdomain,
  projectSlug,
  issueId,
  params,
  enabled = true,
}: UseIssueSubtasksOptions) {
  return useInfiniteQuery<SubtaskListResponse>({
    queryKey: [
      "issue-subtasks",
      subdomain,
      projectSlug,
      String(issueId),
      params,
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchIssueSubtasks({
        subdomain,
        projectSlug,
        issueId: issueId as number | string,
        params: {
          ...params,
          page: pageParam as number,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get("page");
        return nextPage ? Number(nextPage) : undefined;
      } catch {
        return undefined;
      }
    },
    enabled: Boolean(enabled && subdomain && projectSlug && issueId),
  });
}

export function useProjectEpics(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["project-epics-list", subdomain, projectSlug],
    queryFn: () =>
      fetchProjectIssues(subdomain, projectSlug, {
        issue_type: "epic",
        page_size: 100,
      }),
    enabled: Boolean(subdomain && projectSlug),
  });
}

interface UseIssueAttachmentsOptions {
  subdomain: string;
  projectSlug: string;
  issueId: number | string | null;
  enabled?: boolean;
}

export function useIssueAttachments({
  subdomain,
  projectSlug,
  issueId,
  enabled = true,
}: UseIssueAttachmentsOptions) {
  return useQuery<AttachmentListResponse>({
    queryKey: ["issue-attachments", subdomain, projectSlug, String(issueId)],
    queryFn: () =>
      fetchIssueAttachments({
        subdomain,
        projectSlug,
        issueId: issueId as number | string,
      }),
    enabled: Boolean(enabled && subdomain && projectSlug && issueId),
  });
}
