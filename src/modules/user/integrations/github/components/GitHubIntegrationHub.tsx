import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGitHubStatus,
  useGitHubRepositoryDetails,
} from "../api/githubQueries";
import {
  useConnectGitHubRepository,
  useStartGitHubConnect,
} from "../api/githubMutations";
import { RepositorySelectorModal } from "./modal/RepositorySelectorModal";
import { GitHubConnectHero } from "./GitHubConnectHero";
import { GitHubConnectedAccountView } from "./GitHubConnectedAccountViewProps";
import { GitHubRepositoryOverview } from "./GitHubRepositoryOverviewProps";
import type { GitHubRepository } from "../types";

interface GitHubIntegrationHubProps {
  subdomain: string;
  projectSlug: string;
  repositoryIdRoute?: number;
}

export function GitHubIntegrationHub({
  subdomain,
  projectSlug,
  repositoryIdRoute,
}: GitHubIntegrationHubProps) {
  const navigate = useNavigate();
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

  const { data: statusData, isLoading } = useGitHubStatus(
    subdomain,
    projectSlug,
  );

  // Determine active repository ID: either from route URL or if there's only 1 repository linked
  const repositories = statusData?.repositories || [];
  const effectiveRepoId =
    repositoryIdRoute ??
    (repositories.length === 1 ? repositories[0].id : null);

  const { data: detailData, isLoading: isLoadingDetail } =
    useGitHubRepositoryDetails(subdomain, projectSlug, effectiveRepoId);

  const { mutate: startConnect, isPending: isConnectingGitHub } =
    useStartGitHubConnect(subdomain, projectSlug);
  const { mutate: connectRepo, isPending: isConnectingRepo } =
    useConnectGitHubRepository(subdomain, projectSlug);

  const handleSelectRepoFromModal = (repo: GitHubRepository) => {
    connectRepo(repo.id, {
      onSuccess: () => {
        setIsRepoModalOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading GitHub integration status...</span>
      </div>
    );
  }

  const isConnected = statusData?.connected ?? false;
  const account = statusData?.account;

  if (!isConnected) {
    return (
      <GitHubConnectHero
        isConnecting={isConnectingGitHub}
        onConnect={() => startConnect()}
      />
    );
  }

  if (effectiveRepoId !== null) {
    if (isLoadingDetail) {
      return (
        <div className="h-64 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Loading repository overview...</span>
        </div>
      );
    }

    if (detailData) {
      return (
        <GitHubRepositoryOverview
          repository={detailData}
          subdomain={subdomain}
          projectSlug={projectSlug}
          showBack={repositories.length > 1}
          onBackToList={() => navigate(`/projects/${projectSlug}/repository`)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <GitHubConnectedAccountView
        account={account ?? null}
        status={statusData?.status ?? null}
        repositories={repositories}
        onOpenLinkModal={() => setIsRepoModalOpen(true)}
        onSelectRepo={(repo) =>
          navigate(`/projects/${projectSlug}/repository/${repo.id}`)
        }
      />

      <RepositorySelectorModal
        isOpen={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        subdomain={subdomain}
        projectSlug={projectSlug}
        onSelectRepo={handleSelectRepoFromModal}
        isConnecting={isConnectingRepo}
      />
    </div>
  );
}
