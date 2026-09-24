import { useQuery } from "@tanstack/react-query";
import { fetchProjectIssues } from "./issueApi";
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
