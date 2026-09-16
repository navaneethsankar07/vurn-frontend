import api from "@/api/axios";
import type {
  Sprint,
  SprintDetailAPIResponse,
  SprintDetailExtended,
} from "../types";
import type { CreateSprintInput } from "../schemas/sprintSchema";
import { DUMMY_SPRINT_EXTENDED } from "../constants";

export async function fetchProjectSprints(
  subdomain: string,
  projectSlug: string,
): Promise<Sprint[]> {
  const response = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/sprints/`,
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

export const sprintQueryKeys = {
  detail: (subdomain: string, projectSlug: string, sprintId: string | number) =>
    [
      "organization",
      subdomain,
      "project",
      projectSlug,
      "sprint",
      String(sprintId),
    ] as const,
};

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
