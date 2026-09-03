import api from "@/api/axios";
import type {
  CreateProjectPayload,
  PaginatedProjectsResponse,
  ProjectListParams,
  ProjectOptionsResponse,
  ProjectResponse,
} from "../types";

export const getProjectOptions = async (): Promise<ProjectOptionsResponse> => {
  const response = await api.get("/projects/options/");
  return response.data;
};

export const createProject = async (
  slug: string,
  payload: CreateProjectPayload,
): Promise<ProjectResponse> => {
  const response = await api.post(`/organizations/${slug}/projects/`, payload);
  return response.data;
};

export const getProjects = async (
  subdomain: string,
  params?: ProjectListParams,
): Promise<PaginatedProjectsResponse> => {
  const response = await api.get<PaginatedProjectsResponse>(
    `/organizations/${subdomain}/projects/`,
    { params },
  );
  return response.data;
};
