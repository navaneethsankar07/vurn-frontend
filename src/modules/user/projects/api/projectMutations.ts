import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProjectMember,
  archiveProject,
  createProject,
  createWorkflowStatus,
  deleteProject,
  removeProjectMember,
  updateProjectSettings,
  updateWorkflowStatus,
} from "./projectApi";
import type {
  AddProjectMemberPayload,
  CreateProjectPayload,
  CreateWorkflowStatusPayload,
  ProjectDeleteRequest,
  ProjectUpdateRequest,
  UpdateWorkflowStatusPayload,
} from "../types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

interface ProjectMutationProps {
  subdomain: string;
  projectSlug: string;
}

export function useUpdateProjectSettings({
  subdomain,
  projectSlug,
}: ProjectMutationProps) {
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

export function useArchiveProject({
  subdomain,
  projectSlug,
}: ProjectMutationProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => archiveProject(subdomain, projectSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-settings", subdomain, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", subdomain],
      });
      toast.success("Project archived successfully.");
      navigate("/projects");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Failed to archive project.";
      toast.error(message);
    },
  });
}

export function useDeleteProject({
  subdomain,
  projectSlug,
}: ProjectMutationProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ProjectDeleteRequest) =>
      deleteProject(subdomain, projectSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", subdomain],
      });
      toast.success("Project deleted successfully.");
      navigate("/projects");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.confirmation?.[0] ||
        error.response?.data?.detail ||
        "Failed to delete project.";
      toast.error(message);
    },
  });
}

export const useAddProjectMember = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProjectMemberPayload) =>
      addProjectMember({ orgSlug, projectSlug, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", orgSlug, projectSlug],
      });
    },
  });
};

export const useRemoveProjectMember = (
  orgSlug: string,
  projectSlug: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number | string) =>
      removeProjectMember({ orgSlug, projectSlug, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", orgSlug, projectSlug],
      });
    },
  });
};

export const useCreateWorkflowStatus = (
  orgSlug: string,
  projectSlug: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkflowStatusPayload) =>
      createWorkflowStatus({ orgSlug, projectSlug, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-workflow", orgSlug, projectSlug],
      });
    },
  });
};

interface UseUpdateWorkflowStatusParams {
  subdomain: string;
  projectSlug: string;
  statusId: string;
}

export function useUpdateWorkflowStatus({
  subdomain,
  projectSlug,
  statusId,
}: UseUpdateWorkflowStatusParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkflowStatusPayload) =>
      updateWorkflowStatus(subdomain, projectSlug, statusId, payload),
    onSuccess: () => {
      toast.success("Workflow status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-workflow", subdomain, projectSlug],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update status.";
      toast.error(errorMessage);
    },
  });
}
