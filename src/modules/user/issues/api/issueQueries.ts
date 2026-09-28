import { useQuery } from "@tanstack/react-query";
import { fetchLabelSuggestions, fetchProjectIssueDetail, fetchProjectIssues } from "./issueApi";
import type { IssueListParams, LabelQueryParams } from "../types";

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
