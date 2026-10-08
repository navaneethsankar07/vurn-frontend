import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepositories, fetchGitHubRepositoryDetails, fetchGitHubStatus } from "./githubApi";

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
