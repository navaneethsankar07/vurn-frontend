import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectSprint, updateProjectSprint } from "./sprintApi";
import type { CreateSprintInput } from "../schemas/createSprintSchema";
import type { UseUpdateProjectSprintParams } from "../types";
import type { UpdateSprintInput } from "../schemas/updateSprintSchema";

export function useCreateProjectSprint(
  subdomain: string,
  projectSlug: string,
  options?: { onSuccess?: () => void },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSprintInput) =>
      createProjectSprint(subdomain, projectSlug, payload),

    onSuccess: () => {
      toast.success("Sprint created successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-sprints", subdomain, projectSlug],
      });
      options?.onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to create sprint.";
      toast.error(errorMessage);
    },
  });
}

export function useUpdateProjectSprint({
  subdomain,
  projectSlug,
  sprintId,
}: UseUpdateProjectSprintParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSprintInput) =>
      updateProjectSprint(subdomain, projectSlug, sprintId, data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: ["project-sprints", subdomain, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["sprint-detail", subdomain, projectSlug, sprintId],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update sprint.";
      toast.error(errorMessage);
    },
  });
}
