import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchIssueComments,
  fetchLabelSuggestions,
  fetchProjectIssueDetail,
  fetchProjectIssues,
} from "./issueApi";
import type {
  GetIssueCommentsParams,
  IssueListParams,
  LabelQueryParams,
  PaginatedCommentsResponse,
} from "../types";

export function useProjectIssues(
  subdomain: string,
  projectSlug: string,
  params?: IssueListParams,
) {
  return useQuery({
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
  return useQuery({
    queryKey: ["project-issue-detail", subdomain, projectSlug, issueId],
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
}: Omit<GetIssueCommentsParams, "page">) {
  return useInfiniteQuery<PaginatedCommentsResponse>({
    queryKey: ["issue-comments", subdomain, projectSlug, String(issueId)],
    queryFn: ({ pageParam = 1 }) =>
      fetchIssueComments({
        subdomain,
        projectSlug,
        issueId,
        page: pageParam as number,
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
