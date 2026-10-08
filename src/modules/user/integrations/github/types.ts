export interface GitHubAccount {
  login: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
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

export interface ConnectedRepositoryDetails {
  id: number;
  external_repository_id: string;
  name: string;
  full_name: string;
  repository_url: string;
  default_branch: string;
  visibility: string;
}

export interface ConnectRepositoryResponse {
  message: string;
  repository: ConnectedRepositoryDetails;
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
