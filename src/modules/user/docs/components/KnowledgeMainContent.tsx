import { FileText, Loader2 } from "lucide-react";
import { KnowledgeHeader } from "./KnowledgeHeader";
import { useDocumentDetail } from "../api/knowledgeQueries";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface KnowledgeMainContentProps {
  subdomain: string;
  projectSlug: string;
  selectedFolderId: number | null;
  selectedDocumentId: number | null;
}

export function KnowledgeMainContent({
  subdomain,
  projectSlug,
  selectedFolderId,
  selectedDocumentId,
}: KnowledgeMainContentProps) {
  const {
    data: document,
    isLoading,
    isError,
  } = useDocumentDetail(subdomain, projectSlug, selectedDocumentId);

  if (!selectedFolderId) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
        <KnowledgeHeader />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
          Select a folder from the sidebar to view documents.
        </div>
      </div>
    );
  }

  if (!selectedDocumentId) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
        <KnowledgeHeader />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
          Select a document from the sidebar to view content.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#060608] font-mono">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090B]">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {document ? document.title : "Loading Document..."}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading document details...</span>
          </div>
        ) : isError || !document ? (
          <div className="h-64 border border-red-500/20 bg-red-500/5 rounded-xs flex items-center justify-center text-center p-6 text-red-400 text-xs">
            Failed to load document.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4 bg-[#09090B] border border-white/10 p-6 rounded-xs">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-lg font-bold text-white">{document.title}</h1>
              <p className="text-[11px] text-zinc-500 pt-1">
                Created by {document.created_by_name} • Updated{" "}
                {formatRelativeTime(document.updated_at)}
              </p>
            </div>
            <div
              className="text-xs text-zinc-300 font-sans leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
