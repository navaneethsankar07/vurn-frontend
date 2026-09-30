import { FileText, Loader2 } from "lucide-react";
import { useProjectDocuments } from "../api/knowledgeQueries";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface KnowledgeDocumentListProps {
  subdomain: string;
  projectSlug: string;
  folderId: number;
  selectedDocumentId: number | null;
  onSelectDocument: (docId: number) => void;
  onCreateDocument: () => void;
}

export function KnowledgeDocumentList({
  subdomain,
  projectSlug,
  folderId,
  selectedDocumentId,
}: KnowledgeDocumentListProps) {
  const { data, isLoading } = useProjectDocuments(subdomain, projectSlug, {
    folder_id: folderId,
  });

  const documents = data?.results || [];
  const activeDocument = documents.find((d) => d.id === selectedDocumentId);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#060608] font-mono">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090B]">
        <div className="flex items-center gap-2.5">
          <FileText className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {activeDocument ? activeDocument.title : "Documentation Viewer"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading document...</span>
          </div>
        ) : activeDocument ? (
          <div className="max-w-4xl mx-auto space-y-4 bg-[#09090B] border border-white/10 p-6 rounded-xs">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-lg font-bold text-white">
                {activeDocument.title}
              </h1>
              <p className="text-[11px] text-zinc-500 pt-1">
                Created by {activeDocument.created_by_name} • Updated{" "}
                {formatRelativeTime(activeDocument.updated_at)}
              </p>
            </div>
            <div className="text-xs text-zinc-300 font-sans leading-relaxed">
              Viewing document content for {activeDocument.title}...
            </div>
          </div>
        ) : (
          <div className="h-64 border border-dashed border-white/10 rounded-xs flex flex-col items-center justify-center text-center p-6 space-y-2">
            <p className="text-xs text-zinc-400">
              Select a document from the sidebar to view content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
