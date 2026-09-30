import api from "@/api/axios";
import type {
  BoardSprintOption,
  KanbanBoardResponse,
  KanbanColumnIssuesParams,
  KanbanColumnIssuesResponse,
  MoveIssueStatusPayload,
  MoveIssueStatusResponse,
  ProjectSprintsQueryParams,
  Sprint,
  SprintDetailAPIResponse,
  SprintIssueItem,
  StartSprintParams,
  StartSprintResponse,
  UpdateIssuePositionPayload,
  UpdateIssuePositionResponse,
} from "../types";
import type { CreateSprintInput } from "../schemas/createSprintSchema";
import type { UpdateSprintInput } from "../schemas/updateSprintSchema";

export async function fetchProjectSprints(
  subdomain: string,
  projectSlug: string,
  params?: ProjectSprintsQueryParams,
): Promise<Sprint[]> {
  const queryParams: Record<string, string | number> = {};

  if (params?.search?.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params?.status) {
    queryParams.status = params.status;
  }
  if (params?.sort) {
    queryParams.sort = params.sort;
  }
  if (params?.page) {
    queryParams.page = params.page;
  }

  const response = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/`,
    { params: queryParams },
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
}

export async function createProjectSprint(
  subdomain: string,
  projectSlug: string,
  payload: CreateSprintInput,
): Promise<Sprint> {
  const response = await api.post(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/`,
    payload,
  );
  return response.data;
}

export async function fetchSprintDetail(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
): Promise<SprintDetailAPIResponse> {
  const { data } = await api.get<SprintDetailAPIResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/${sprintId}/`,
  );
  return data;
}

export async function fetchSprintIssues(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
  page: number = 1,
): Promise<{
  results: SprintIssueItem[];
  count: number;
  next: string | null;
  previous: string | null;
}> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/issues/`,
    { params: { sprint_id: sprintId, page } },
  );
  return data;
}

export async function updateProjectSprint(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
  data: UpdateSprintInput,
) {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/${sprintId}/`,
    data,
  );
  return response.data;
}

export const startProjectSprint = async ({
  subdomain,
  projectSlug,
  sprintId,
}: StartSprintParams): Promise<StartSprintResponse> => {
  const response = await api.post<StartSprintResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/${sprintId}/start/`,
  );
  return response.data;
};

export async function fetchKanbanBoard(
  subdomain: string,
  projectSlug: string,
): Promise<KanbanBoardResponse> {
  const response = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/board/`,
  );
  return response.data;
}

export async function fetchColumnIssues(
  subdomain: string,
  projectSlug: string,
  statusId: number | string,
  params?: KanbanColumnIssuesParams,
): Promise<KanbanColumnIssuesResponse> {
  const response = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/board/columns/${statusId}/issues/`,
    { params },
  );
  return response.data;
}

export async function moveIssueStatus({
  subdomain,
  projectSlug,
  issueId,
  status_id,
}: MoveIssueStatusPayload): Promise<MoveIssueStatusResponse> {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/board/issues/${issueId}/status/`,
    { status_id },
  );
  return response.data;
}

export async function updateIssuePosition({
  subdomain,
  projectSlug,
  issueId,
  position,
}: UpdateIssuePositionPayload): Promise<UpdateIssuePositionResponse> {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/board/issues/${issueId}/position/`,
    { position },
  );
  return response.data;
}

export async function fetchBoardSprints(
  subdomain: string,
  projectSlug: string,
): Promise<BoardSprintOption[]> {
  const response = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/board/sprints/`,
  );
  return response.data;
}
