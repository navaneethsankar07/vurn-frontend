import { FeaturesHero } from "../components/FeaturesHero";
import { WorkspaceGrid } from "../components/WorkspaceGrid";
import { GitHubIntegrationSection } from "../components/GitHubIntegrationSection";
import { AiWorkflowSection } from "../components/AiWorkflowSection";
import { EngineerWorkflowSection } from "../components/EngineerWorkflowSection";
import { CtaBanner } from "../../landing/components/CtaBanner";

export function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white pt-16 overflow-x-hidden">
      <FeaturesHero />
      <WorkspaceGrid />
      <GitHubIntegrationSection />
      <AiWorkflowSection />
      <EngineerWorkflowSection />
      <CtaBanner />
    </div>
  );
}
