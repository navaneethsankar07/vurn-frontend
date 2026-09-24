import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectIssue } from "./issueApi";
import type { CreateIssueParams, IssueItem } from "../types";

export function useCreateProjectIssue() {
  const queryClient = useQueryClient();

  return useMutation<IssueItem, any, CreateIssueParams>({
    mutationFn: createProjectIssue,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["kanban-board", variables.subdomain, variables.projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "project-sprints",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      toast.success(`${data.key} created successfully.`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.title?.[0] ||
        "Failed to create work item.";
      toast.error(message);
    },
  });
}
