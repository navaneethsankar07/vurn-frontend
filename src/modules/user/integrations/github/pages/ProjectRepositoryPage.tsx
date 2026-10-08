import { getSubdomain } from "@/utils/subdomain";
import { useParams } from "react-router-dom";
import { GitHubIntegrationHub } from "../components/GitHubIntegrationHub";

export function ProjectRepositoryPage() {
  const subdomain = getSubdomain() || "";
  const { projectSlug } = useParams<{ projectSlug: string }>();

  return (
    <div className="space-y-6">
      <GitHubIntegrationHub
        subdomain={subdomain}
        projectSlug={projectSlug || ""}
      />
    </div>
  );
}
