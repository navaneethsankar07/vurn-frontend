import { useMutation } from "@tanstack/react-query";
import { createProject } from "./projectApi";
import type { CreateProjectPayload } from "../types";

export const useCreateProjectMutation = (slug: string) => {
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(slug, payload),
  });
};
