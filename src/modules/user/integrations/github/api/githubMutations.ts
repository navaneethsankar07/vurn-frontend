import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeGitHubConnect,
  connectGitHubRepository,
  linkGitHubIssue,
  startGitHubConnect,
} from "./githubApi";
import type { GitHubCompleteInput, GitHubCompleteResponse, GitHubIssueLinkPayload } from "../types";
import { getOrganizationUrl } from "@/utils/subdomain";

export function useStartGitHubConnect(subdomain: string, projectSlug: string) {
  return useMutation({
    mutationFn: () => startGitHubConnect(subdomain, projectSlug),
    onSuccess: (data) => {
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ||
          "Failed to initialize GitHub connection.",
      );
    },
  });
}

export function useConnectGitHubRepository(
  subdomain: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repositoryId: number) =>
      connectGitHubRepository(subdomain, projectSlug, repositoryId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["github-status", subdomain, projectSlug],
      });
      toast.success(data?.message || "Repository connected successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || "Failed to connect repository.",
      );
    },
  });
}

export function useCompleteGitHubConnect() {
  return useMutation({
    mutationFn: (data: GitHubCompleteInput) => completeGitHubConnect(data),

    onSuccess: (data: GitHubCompleteResponse) => {
      toast.success("GitHub connected successfully.");

      const url = getOrganizationUrl(
        data.organization_slug,
        `/projects/${data.project_slug}/repository`,
      );

      window.location.replace(url);
    },

    onError: (error: any) => {
      const response = error?.response?.data;

      const organizationSlug = response?.organization_slug;
      const projectSlug = response?.project_slug;

      toast.error(response?.detail || "Failed to complete GitHub integration.");

      if (organizationSlug && projectSlug) {
        const url = getOrganizationUrl(
          organizationSlug,
          `/projects/${projectSlug}/repository`,
        );

        window.location.replace(url);
      }
    },
  });
}

interface LinkIssueParams {
  subdomain: string;
  projectSlug: string;
  repositoryId: number;
  gitIssueId: number;
  payload: GitHubIssueLinkPayload;
}

export function useLinkGitHubIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subdomain,
      projectSlug,
      repositoryId,
      gitIssueId,
      payload,
    }: LinkIssueParams) =>
      linkGitHubIssue(
        subdomain,
        projectSlug,
        repositoryId,
        gitIssueId,
        payload,
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["github-issues", variables.subdomain, variables.projectSlug],
      });
      toast.success(data?.message || "GitHub issue linked successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Failed to link GitHub issue.";
      toast.error(message);
    },
  });
}
