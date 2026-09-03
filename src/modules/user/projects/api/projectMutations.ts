import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "./projectApi";
import type { CreateProjectPayload } from "../types";

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
