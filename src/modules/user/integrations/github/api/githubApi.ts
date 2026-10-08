import api from "@/api/axios";
import type {
  ConnectRepositoryResponse,
  GitHubBranchesResponse,
  GitHubCommitsResponse,
  GitHubCompleteInput,
  GitHubCompleteResponse,
  GitHubConnectResponse,
  GitHubIntegrationStatus,
  GitHubRepositoriesResponse,
  GitHubRepository,
} from "../types";

export async function fetchGitHubStatus(
  subdomain: string,
  projectSlug: string,
): Promise<GitHubIntegrationStatus> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/`,
  );
  return data;
}

export async function startGitHubConnect(
  subdomain: string,
  projectSlug: string,
): Promise<GitHubConnectResponse> {
  const { data } = await api.post(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/connect/`,
  );
  return data;
}

export async function fetchGitHubRepositories(
  subdomain: string,
  projectSlug: string,
): Promise<GitHubRepositoriesResponse> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/`,
  );
  return data;
}

export async function fetchGitHubRepositoryDetails(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | string,
): Promise<GitHubRepository> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/${repositoryId}/`,
  );
  return data;
}

export async function connectGitHubRepository(
  subdomain: string,
  projectSlug: string,
  repositoryId: number,
): Promise<ConnectRepositoryResponse> {
  const { data } = await api.post(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/connect/`,
    { repository_id: repositoryId },
  );
  return data;
}

export async function completeGitHubConnect(
  data: GitHubCompleteInput,
): Promise<GitHubCompleteResponse> {
  const { data: response } = await api.post(
    "/integrations/github/complete/",
    data,
  );
  return response;
}

export async function fetchGitHubBranches(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | string,
): Promise<GitHubBranchesResponse> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/${repositoryId}/branches/`,
  );
  return data;
}

export async function fetchGitHubCommits(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | string,
  branch?: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<GitHubCommitsResponse> {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/${repositoryId}/commits/?${params.toString()}`,
  );
  return data;
}
