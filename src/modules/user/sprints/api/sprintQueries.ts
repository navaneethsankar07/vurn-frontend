import { useQuery } from "@tanstack/react-query";
import { fetchProjectSprints } from "./sprintApi";

export function useProjectSprints(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["project-sprints", subdomain, projectSlug],
    queryFn: () => fetchProjectSprints(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}
