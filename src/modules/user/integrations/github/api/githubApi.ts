import api from "@/api/axios";
import type {
  ConnectRepositoryResponse,
  GitHubBranchesResponse,
  GitHubCommitsResponse,
  GitHubCompleteInput,
  GitHubCompleteResponse,
  GitHubConnectResponse,
  GitHubIntegrationStatus,
  GitHubIssuesResponse,
  GitHubPullRequestsResponse,
  GitHubRepositoriesResponse,
  GitHubRepository,
  WorkItemOptionsResponse,
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

export async function fetchGitHubPullRequests(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | string,
  state: string = "open",
  page: number = 1,
  pageSize: number = 5,
): Promise<GitHubPullRequestsResponse> {
  const params = new URLSearchParams();
  params.append("state", state);
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/${repositoryId}/pull-requests/?${params.toString()}`,
  );
  return data;
}

export async function fetchGitHubIssues(
  subdomain: string,
  projectSlug: string,
  repositoryId: number | string,
  state: string = "open",
  sort: string = "updated",
  direction: string = "desc",
  page: number = 1,
  pageSize: number = 5,
): Promise<GitHubIssuesResponse> {
  const params = new URLSearchParams();
  params.append("state", state);
  params.append("sort", sort);
  params.append("direction", direction);
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/integrations/github/repositories/${repositoryId}/issues/?${params.toString()}`,
  );
  return data;
}

export async function fetchWorkItemOptions(
  subdomain: string,
  projectSlug: string,
  search?: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<WorkItemOptionsResponse> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/work-item-options/?${params.toString()}`,
  );
  return data;
}
