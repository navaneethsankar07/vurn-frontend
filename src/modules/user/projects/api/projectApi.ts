import api from "@/api/axios";
import type {
  AddProjectMemberPayload,
  AddProjectMemberResponse,
  CreateProjectPayload,
  CreateWorkflowStatusParams,
  GetProjectMembersParams,
  PaginatedProjectsResponse,
  ProjectDeleteRequest,
  ProjectDetail,
  ProjectListParams,
  ProjectMemberListResponse,
  ProjectOptionsResponse,
  ProjectResponse,
  ProjectUpdateRequest,
  RemoveProjectMemberParams,
  RemoveProjectMemberResponse,
  UpdateWorkflowStatusPayload,
  UpdateWorkflowTransitionParams,
  WorkflowOverviewResponse,
  WorkflowStatus,
  WorkflowTransition,
  WorkflowTransitionPayload,
} from "../types";

export const getProjectOptions = async (): Promise<ProjectOptionsResponse> => {
  const response = await api.get("/projects/options/");
  return response.data;
};

export const createProject = async (
  slug: string,
  payload: CreateProjectPayload,
): Promise<ProjectResponse> => {
  const response = await api.post(`/organizations/${slug}/projects/`, payload);
  return response.data;
};

export const getProjects = async (
  subdomain: string,
  params?: ProjectListParams,
): Promise<PaginatedProjectsResponse> => {
  const response = await api.get<PaginatedProjectsResponse>(
    `/organizations/${subdomain}/projects/`,
    { params },
  );
  return response.data;
};

export async function getProjectSettings(
  subdomain: string,
  projectSlug: string,
): Promise<ProjectDetail> {
  const response = await api.get<ProjectDetail>(
    `/organizations/${subdomain}/projects/${projectSlug}/settings/`,
  );
  return response.data;
}

export async function updateProjectSettings(
  subdomain: string,
  projectSlug: string,
  data: ProjectUpdateRequest,
): Promise<ProjectDetail> {
  const formData = new FormData();

  if (data.name !== undefined) formData.append("name", data.name);
  if (data.key !== undefined) formData.append("key", data.key);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.status !== undefined) formData.append("status", data.status);
  if (data.icon !== undefined) formData.append("icon", data.icon);
  if (data.accent_color !== undefined)
    formData.append("accent_color", data.accent_color);

  if (data.logo instanceof File) {
    formData.append("logo", data.logo);
  }

  const response = await api.patch<ProjectDetail>(
    `/organizations/${subdomain}/projects/${projectSlug}/settings/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function archiveProject(
  subdomain: string,
  projectSlug: string,
): Promise<ProjectDetail> {
  const response = await api.post<ProjectDetail>(
    `/organizations/${subdomain}/projects/${projectSlug}/archive/`,
  );
  return response.data;
}

export async function deleteProject(
  subdomain: string,
  projectSlug: string,
  data: ProjectDeleteRequest,
): Promise<void> {
  await api.delete(`/organizations/${subdomain}/projects/${projectSlug}/`, {
    data,
  });
}

export const getProjectMembers = async (
  orgSlug: string,
  projectSlug: string,
  params?: GetProjectMembersParams,
): Promise<ProjectMemberListResponse> => {
  const response = await api.get<ProjectMemberListResponse>(
    `/organizations/${orgSlug}/projects/${projectSlug}/members/`,
    { params },
  );
  return response.data;
};

export async function addProjectMember({
  orgSlug,
  projectSlug,
  payload,
}: {
  orgSlug: string;
  projectSlug: string;
  payload: AddProjectMemberPayload;
}): Promise<AddProjectMemberResponse> {
  const response = await api.post<AddProjectMemberResponse>(
    `/organizations/${orgSlug}/projects/${projectSlug}/members/`,
    payload,
  );
  return response.data;
}

export const removeProjectMember = async ({
  orgSlug,
  projectSlug,
  memberId,
}: RemoveProjectMemberParams): Promise<RemoveProjectMemberResponse> => {
  const response = await api.delete<RemoveProjectMemberResponse>(
    `/organizations/${orgSlug}/projects/${projectSlug}/members/${memberId}/`,
  );
  return response.data;
};

export const getProjectWorkflow = async (
  orgSlug: string,
  projectSlug: string,
): Promise<WorkflowOverviewResponse> => {
  const response = await api.get<WorkflowOverviewResponse>(
    `/organizations/${orgSlug}/projects/${projectSlug}/workflow/`,
  );
  return response.data;
};

export const createWorkflowStatus = async ({
  orgSlug,
  projectSlug,
  payload,
}: CreateWorkflowStatusParams): Promise<WorkflowStatus> => {
  const response = await api.post<WorkflowStatus>(
    `/organizations/${orgSlug}/projects/${projectSlug}/workflow/statuses/`,
    payload,
  );
  return response.data;
};

export async function updateWorkflowStatus(
  subdomain: string,
  projectSlug: string,
  statusId: string,
  payload: UpdateWorkflowStatusPayload,
): Promise<WorkflowStatus> {
  const response = await api.patch<WorkflowStatus>(
    `/organizations/${subdomain}/projects/${projectSlug}/workflow/statuses/${statusId}/`,
    payload,
  );
  return response.data;
}

export async function deleteWorkflowStatus(
  subdomain: string,
  projectSlug: string,
  statusId: string,
): Promise<void> {
  await api.delete(
    `/organizations/${subdomain}/projects/${projectSlug}/workflow/statuses/${statusId}/`,
  );
}

export async function createWorkflowTransition(
  subdomain: string,
  projectSlug: string,
  payload: WorkflowTransitionPayload,
): Promise<WorkflowTransition> {
  const response = await api.post<WorkflowTransition>(
    `/organizations/${subdomain}/projects/${projectSlug}/workflow/transitions/`,
    payload,
  );
  return response.data;
}

export const updateWorkflowStatusPosition = async ({
  subdomain,
  projectSlug,
  statusId,
  position,
}: {
  subdomain: string;
  projectSlug: string;
  statusId: number;
  position: number;
}) => {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/workflow/statuses/${statusId}/position/`,
    { position },
  );
  return response.data;
};

export async function updateWorkflowTransition({
  subdomain,
  projectSlug,
  transitionId,
  data,
}: UpdateWorkflowTransitionParams): Promise<WorkflowTransition> {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/workflow/transitions/${transitionId}/`,
    data,
  );
  return response.data;
}
