import { useQuery } from "@tanstack/react-query";
import { fetchProjectIssueDetail, fetchProjectIssues } from "./issueApi";
import type { IssueListParams } from "../types";

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
