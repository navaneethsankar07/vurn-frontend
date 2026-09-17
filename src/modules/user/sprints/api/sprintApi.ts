import api from "@/api/axios";
import type {
  ProjectSprintsQueryParams,
  Sprint,
  SprintDetailAPIResponse,
  SprintDetailExtended,
  StartSprintParams,
  StartSprintResponse,
} from "../types";
import type { CreateSprintInput } from "../schemas/createSprintSchema";
import { DUMMY_SPRINT_EXTENDED } from "../constants";
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
): Promise<SprintDetailExtended> {
  const { data } = await api.get<SprintDetailAPIResponse>(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/${sprintId}/`,
  );

  return {
    ...data,
    ...DUMMY_SPRINT_EXTENDED,
  };
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
