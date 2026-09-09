import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProjectSettings } from "./projectApi";
import type { CreateProjectPayload, ProjectUpdateRequest } from "../types";

export const useCreateProjectMutation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

interface UseUpdateProjectSettingsProps {
  subdomain: string;
  projectSlug: string;
}

export function useUpdateProjectSettings({
  subdomain,
  projectSlug,
}: UseUpdateProjectSettingsProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectUpdateRequest) =>
      updateProjectSettings(subdomain, projectSlug, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({
        queryKey: ["project", subdomain, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", subdomain],
      });
      return updatedProject;
    },
  });
}
