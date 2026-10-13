import { getSubdomain } from "@/utils/subdomain";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { toast } from "sonner";
import { GitHubIntegrationHub } from "../components/GitHubIntegrationHub";

export function ProjectRepositoryPage() {
  const subdomain = getSubdomain() || "";
  const { projectSlug, repositoryId } = useParams<{
    projectSlug: string;
    repositoryId?: string;
  }>();

  console.log(repositoryId);

  const queryClient = useQueryClient();

  useKeyboardShortcuts({
    onRefreshRepository: () => {
      if (repositoryId) {
        queryClient.invalidateQueries({
          queryKey: ["github-repository-detail", subdomain, projectSlug],
        });
        queryClient.invalidateQueries({
          queryKey: ["github-branches", subdomain, projectSlug],
        });
        queryClient.invalidateQueries({
          queryKey: ["github-commits", subdomain, projectSlug],
        });
        queryClient.invalidateQueries({
          queryKey: ["github-pull-requests", subdomain, projectSlug],
        });
        queryClient.invalidateQueries({
          queryKey: ["github-issues", subdomain, projectSlug],
        });
        toast.success("Refreshing repository data...");
      } else {
        toast.error("Please select or connect a repository first.");
      }
    },
  });

  return (
    <div className="space-y-6">
      <GitHubIntegrationHub
        subdomain={subdomain}
        projectSlug={projectSlug || ""}
        repositoryIdRoute={repositoryId ? Number(repositoryId) : undefined}
      />
    </div>
  );
}
