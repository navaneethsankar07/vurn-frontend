import api from "@/api/axios";
import type { Sprint } from "../types";

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
