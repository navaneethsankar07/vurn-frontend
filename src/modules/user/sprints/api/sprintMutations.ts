import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProjectSprint,
  moveIssueStatus,
  startProjectSprint,
  updateIssuePosition,
  updateProjectSprint,
} from "./sprintApi";
import type { CreateSprintInput } from "../schemas/createSprintSchema";
import type {
  MoveIssueStatusPayload,
  MoveIssueStatusResponse,
  StartSprintParams,
  StartSprintResponse,
  UpdateIssuePositionPayload,
  UpdateIssuePositionResponse,
  UseUpdateProjectSprintParams,
} from "../types";
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

export const useStartProjectSprint = () => {
  const queryClient = useQueryClient();

  return useMutation<StartSprintResponse, Error, StartSprintParams>({
    mutationFn: startProjectSprint,
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: [
          "project-sprints",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "sprint-detail",
          variables.subdomain,
          variables.projectSlug,
          String(variables.sprintId),
        ],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to start sprint.";
      toast.error(errorMessage);
    },
  });
};

export function useMoveIssueStatus() {
  const queryClient = useQueryClient();

  return useMutation<MoveIssueStatusResponse, any, MoveIssueStatusPayload>({
    mutationFn: moveIssueStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
        ],
      });
      toast.success(data.message || "Issue status updated.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to move issue.";
      toast.error(message);
    },
  });
}

export function useUpdateIssuePosition() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateIssuePositionResponse,
    any,
    UpdateIssuePositionPayload
  >({
    mutationFn: updateIssuePosition,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "kanban-column-issues",
          variables.subdomain,
          variables.projectSlug,
          variables.status_id,
        ],
      });
      toast.success(data.message || "Issue position updated.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update issue position.";
      toast.error(message);
    },
  });
}
