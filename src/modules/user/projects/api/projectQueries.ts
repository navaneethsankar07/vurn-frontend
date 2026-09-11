import { useQuery } from "@tanstack/react-query";
import {
  getProjectMembers,
  getProjectOptions,
  getProjects,
  getProjectSettings,
  getProjectWorkflow,
} from "./projectApi";
import type {
  GetProjectMembersParams,
  ProjectDetail,
  ProjectListParams,
} from "../types";

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

export const useProjectMembers = (
  orgSlug: string,
  projectSlug: string,
  params?: GetProjectMembersParams,
) => {
  return useQuery({
    queryKey: ["project-members", orgSlug, projectSlug, params],
    queryFn: () => getProjectMembers(orgSlug, projectSlug, params),
    enabled: Boolean(orgSlug && projectSlug),
  });
};

export const useProjectWorkflow = (orgSlug: string, projectSlug: string) => {
  return useQuery({
    queryKey: ["project-workflow", orgSlug, projectSlug],
    queryFn: () => getProjectWorkflow(orgSlug, projectSlug),
    enabled: Boolean(orgSlug && projectSlug),
  });
};
