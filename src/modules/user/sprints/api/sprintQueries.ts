import { useQuery } from "@tanstack/react-query";
import { fetchProjectSprints, fetchSprintDetail } from "./sprintApi";
import type { ProjectSprintsQueryParams } from "../types";

export function useProjectSprints(
  subdomain: string,
  projectSlug: string,
  params?: ProjectSprintsQueryParams,
) {
  return useQuery({
    queryKey: ["project-sprints", subdomain, projectSlug, params],
    queryFn: () => fetchProjectSprints(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useSprintDetail(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
) {
  return useQuery({
    queryKey: ["sprint-detail", subdomain, projectSlug, sprintId],
    queryFn: () => fetchSprintDetail(subdomain, projectSlug, sprintId),
    enabled: Boolean(subdomain && projectSlug && sprintId),
  });
}
