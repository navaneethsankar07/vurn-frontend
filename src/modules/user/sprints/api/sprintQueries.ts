import { useQuery } from "@tanstack/react-query";
import { fetchProjectSprints, fetchSprintDetail, sprintQueryKeys } from "./sprintApi";

export function useProjectSprints(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["project-sprints", subdomain, projectSlug],
    queryFn: () => fetchProjectSprints(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useSprintDetail(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
) {
  return useQuery({
    queryKey: sprintQueryKeys.detail(subdomain, projectSlug, sprintId),
    queryFn: () => fetchSprintDetail(subdomain, projectSlug, sprintId),
    enabled: Boolean(subdomain && projectSlug && sprintId),
  });
}