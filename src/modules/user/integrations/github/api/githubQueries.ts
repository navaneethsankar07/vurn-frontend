import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchGitHubBranches,
  fetchGitHubCommits,
  fetchGitHubIssues,
  fetchGitHubPullRequests,
  fetchGitHubRepositories,
  fetchGitHubRepositoryDetails,
  fetchGitHubStatus,
  fetchWorkItemOptions,
} from "./githubApi";

export function useGitHubStatus(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["github-status", subdomain, projectSlug],
    queryFn: () => fetchGitHubStatus(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useGitHubRepositories(
  subdomain: string,
  projectSlug: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["github-repositories", subdomain, projectSlug],
    queryFn: () => fetchGitHubRepositories(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug && enabled),
  });
}

export function useGitHubRepositoryDetails(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | null,
) {
  return useQuery({
    queryKey: [
      "github-repository-detail",
      subdomain,
      projectSlug,
      repositoryId,
    ],
    queryFn: () =>
      fetchGitHubRepositoryDetails(subdomain, projectSlug, repositoryId!),
    enabled: Boolean(subdomain && projectSlug && repositoryId !== null),
  });
}

export function useGitHubBranches(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | null,
) {
  return useQuery({
    queryKey: ["github-branches", subdomain, projectSlug, repositoryId],
    queryFn: () => fetchGitHubBranches(subdomain, projectSlug, repositoryId!),
    enabled: Boolean(subdomain && projectSlug && repositoryId !== null),
  });
}

export function useGitHubCommits(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | null,
  branch?: string,
  page: number = 1,
  pageSize: number = 5,
) {
  return useQuery({
    queryKey: [
      "github-commits",
      subdomain,
      projectSlug,
      repositoryId,
      branch,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchGitHubCommits(
        subdomain,
        projectSlug,
        repositoryId!,
        branch,
        page,
        pageSize,
      ),
    enabled: Boolean(subdomain && projectSlug && repositoryId !== null),
  });
}

export function useGitHubPullRequests(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | null,
  state: string = "open",
  page: number = 1,
  pageSize: number = 5,
) {
  return useQuery({
    queryKey: [
      "github-pull-requests",
      subdomain,
      projectSlug,
      repositoryId,
      state,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchGitHubPullRequests(
        subdomain,
        projectSlug,
        repositoryId!,
        state,
        page,
        pageSize,
      ),
    enabled: Boolean(subdomain && projectSlug && repositoryId !== null),
  });
}

export function useGitHubIssues(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | null,
  state: string = "open",
  sort: string = "updated",
  direction: string = "desc",
  page: number = 1,
  pageSize: number = 5,
) {
  return useQuery({
    queryKey: [
      "github-issues",
      subdomain,
      projectSlug,
      repositoryId,
      state,
      sort,
      direction,
      page,
      pageSize,
    ],
    queryFn: () =>
      fetchGitHubIssues(
        subdomain,
        projectSlug,
        repositoryId!,
        state,
        sort,
        direction,
        page,
        pageSize,
      ),
    enabled: Boolean(subdomain && projectSlug && repositoryId !== null),
  });
}

export function useInfiniteWorkItemOptions(
  subdomain: string,
  projectSlug: string,
  search?: string,
) {
  return useInfiniteQuery({
    queryKey: ["work-item-options-infinite", subdomain, projectSlug, search],
    queryFn: ({ pageParam = 1 }) =>
      fetchWorkItemOptions(
        subdomain,
        projectSlug,
        search,
        pageParam as number,
        10,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const nextParam = url.searchParams.get("page");
        return nextParam ? Number(nextParam) : undefined;
      } catch {
        return undefined;
      }
    },
    initialPageParam: 1,
    enabled: Boolean(subdomain && projectSlug),
  });
}
