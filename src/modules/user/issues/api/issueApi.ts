import api from "@/api/axios";
import type {
  AddIssueLabelParams,
  CreateCommentParams,
  CreateCommentResponse,
  CreateIssueParams,
  DeleteCommentParams,
  DeleteCommentResponse,
  GetIssueCommentsParams,
  IssueDetailParams,
  IssueDetailResponse,
  IssueItem,
  IssueLabel,
  IssueListParams,
  IssueListResponse,
  LabelQueryParams,
  PaginatedCommentsResponse,
  RemoveIssueLabelParams,
  UpdateCommentParams,
  UpdateCommentResponse,
  UpdateIssueParams,
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

export async function updateProjectIssue({
  subdomain,
  projectSlug,
  issueId,
  data,
}: UpdateIssueParams): Promise<IssueDetailResponse> {
  const response = await api.patch<IssueDetailResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/`,
    data,
  );
  return response.data;
}

export async function fetchLabelSuggestions(
  subdomain: string,
  projectSlug: string,
  params?: LabelQueryParams,
): Promise<IssueLabel[]> {
  const response = await api.get<IssueLabel[]>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/labels/`,
    { params },
  );
  return response.data;
}

export async function addIssueLabel({
  subdomain,
  projectSlug,
  issueId,
  data,
}: AddIssueLabelParams): Promise<IssueLabel> {
  const response = await api.post<IssueLabel>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/labels/`,
    data,
  );
  return response.data;
}

export async function removeIssueLabel({
  subdomain,
  projectSlug,
  issueId,
  labelId,
}: RemoveIssueLabelParams): Promise<void> {
  await api.delete(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/labels/${labelId}/`,
  );
}

export async function createIssueComment({
  subdomain,
  projectSlug,
  issueId,
  data,
}: CreateCommentParams): Promise<CreateCommentResponse> {
  const response = await api.post<CreateCommentResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/comments/`,
    data,
  );
  return response.data;
}

export async function fetchIssueComments({
  subdomain,
  projectSlug,
  issueId,
  page = 1,
  sort = "newest",
}: GetIssueCommentsParams): Promise<PaginatedCommentsResponse> {
  const response = await api.get<PaginatedCommentsResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/comments/`,
    {
      params: {
        page,
        sort,
      },
    },
  );
  return response.data;
}

export async function updateIssueComment({
  subdomain,
  projectSlug,
  issueId,
  commentId,
  data,
}: UpdateCommentParams): Promise<UpdateCommentResponse> {
  const response = await api.patch<UpdateCommentResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/comments/${commentId}/`,
    data,
  );
  return response.data;
}

export async function deleteIssueComment({
  subdomain,
  projectSlug,
  issueId,
  commentId,
}: DeleteCommentParams): Promise<DeleteCommentResponse> {
  const response = await api.delete<DeleteCommentResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/${issueId}/comments/${commentId}/`,
  );
  return response.data;
}
