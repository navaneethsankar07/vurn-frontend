import { useQuery } from "@tanstack/react-query";
import { getProjectOptions, getProjects, getProjectSettings } from "./projectApi";
import type { ProjectDetail, ProjectListParams } from "../types";

export const useProjectOptions = () => {
  return useQuery({
    queryKey: ["project-options"],
    queryFn: getProjectOptions,
  });
};

export const useProjects = (subdomain: string, params?: ProjectListParams) => {
  return useQuery({
    queryKey: ["projects", subdomain, params],
    queryFn: () => getProjects(subdomain, params),
    enabled: Boolean(subdomain),
    staleTime: 60 * 1000,
  });
};

export function useProjectSettings(subdomain: string, projectSlug: string) {
  return useQuery<ProjectDetail>({
    queryKey: ["project-settings", subdomain, projectSlug],
    queryFn: () => getProjectSettings(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}
