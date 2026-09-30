// src/modules/knowledge/pages/KnowledgePage.tsx
import { useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { KnowledgeSidebar } from "../components/KnowledgeSidebar";
import { KnowledgeHeader } from "../components/KnowledgeHeader";

export function KnowledgePage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  return (
    <div className="bg-black text-white flex h-[calc(100vh-60px)] font-mono overflow-hidden">
      <KnowledgeSidebar subdomain={subdomain} projectSlug={projectSlug} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
        <KnowledgeHeader />

        <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
          Select or create a folder to view documentation.
        </div>
      </div>
    </div>
  );
}
