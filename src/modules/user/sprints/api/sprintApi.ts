import api from "@/api/axios";
import type { Sprint } from "../types";
import type { CreateSprintInput } from "../schemas/sprintSchema";

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
