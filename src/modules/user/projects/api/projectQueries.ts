import { useQuery } from "@tanstack/react-query";
import { getProjectOptions, getProjects } from "./projectApi";
import type { ProjectListParams } from "../types";

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
