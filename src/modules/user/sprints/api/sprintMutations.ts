import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectSprint } from "./sprintApi";
import type { CreateSprintInput } from "../schemas/sprintSchema";

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
