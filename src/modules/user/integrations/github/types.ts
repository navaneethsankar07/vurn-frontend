export interface GitHubAccount {
  login: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  external_repository_id: string;
  name: string;
  full_name: string;
  repository_url: string;
  default_branch: string;
  visibility: string;
  description: string | null;
  is_archived: boolean;
  stars: number;
  forks: number;
  open_issues: number;
  language: string | null;
  github_created_at: string;
  github_updated_at: string;
}

export interface GitHubIntegrationStatus {
  connected: boolean;
  provider: string;
  status: string | null;
  account: GitHubAccount | null;
  repositories: GitHubRepository[];
}

export interface GitHubConnectResponse {
  authorization_url: string;
}

export interface GitHubRepositoriesResponse {
  repositories: GitHubRepository[];
}

export interface ConnectRepositoryResponse {
  message: string;
  repository: GitHubRepository;
}

export interface GitHubCompleteInput {
  installation_id: string | number;
  setup_action?: string;
  state: string;
}

export interface GitHubCompleteResponse {
  message: string;
  integration_id: number;
  provider: string;
  organization_slug: string;
  project_slug: string;
  account: GitHubAccount;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubBranchesResponse {
  branches: GitHubBranch[];
}

export interface GitHubCommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface GitHubCommitItem {
  sha: string;
  message: string;
  author: GitHubCommitAuthor;
  url: string;
  linked_issue?: string | null;
}

export interface GitHubPaginationLinks {
  next: string | null;
  previous: string | null;
  first: string | null;
  last: string | null;
}

export interface GitHubCommitsResponse {
  branch: string;
  page: number;
  page_size: number;
  pagination: GitHubPaginationLinks;
  commits: GitHubCommitItem[];
}

export interface GitHubPullRequestItem {
  id: number;
  external_id: string;
  pr_number: number;
  title: string;
  description: string | null;
  state: string;
  draft: boolean;
  author_username: string;
  source_branch: string;
  target_branch: string;
  url: string;
  opened_at: string;
  merged_at: string | null;
  closed_at: string | null;
  created_at: string;
}

export interface GitHubPullRequestsResponse {
  state: string;
  page: number;
  page_size: number;
  pagination: GitHubPaginationLinks;
  pull_requests: GitHubPullRequestItem[];
}

export interface WorkItemReference {
  id: number;
  key: string;
  issue_number: number;
  title: string;
  issue_type: string;
  status_name: string;
}

export interface GitHubIssueItem {
  id: number;
  external_id: string;
  issue_number: number;
  title: string;
  description: string | null;
  state: string;
  author_username: string;
  url: string;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  is_linked: boolean;
  work_item: WorkItemReference | null;
}

export interface GitHubIssuesResponse {
  state: string;
  sort: string;
  direction: string;
  page: number;
  page_size: number;
  pagination: GitHubPaginationLinks;
  issues: GitHubIssueItem[];
}

export interface WorkItemOptionItem {
  id: number;
  key: string;
  title: string;
  status_name: string;
}

export interface WorkItemOptionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkItemOptionItem[];
}
