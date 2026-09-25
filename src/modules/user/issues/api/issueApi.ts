import api from "@/api/axios";
import type {
  CreateIssueParams,
  IssueDetailParams,
  IssueDetailResponse,
  IssueItem,
  IssueListParams,
  IssueListResponse,
} from "../types";

export async function createProjectIssue({
  subdomain,
  projectSlug,
  data,
}: CreateIssueParams): Promise<IssueItem> {
  const response = await api.post<IssueItem>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/`,
    data,
  );
  return response.data;
}

export async function fetchProjectIssues(
  subdomain: string,
  projectSlug: string,
  params?: IssueListParams,
): Promise<IssueListResponse> {
  const response = await api.get<IssueListResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/`,
    { params },
  );
  return response.data;
}

export async function fetchProjectIssueDetail({
  subdomain,
  projectSlug,
  issueId,
}: IssueDetailParams): Promise<IssueDetailResponse> {
  const response = await api.get<IssueDetailResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/`,
  );
  return response.data;
}