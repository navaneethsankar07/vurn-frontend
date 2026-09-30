import { useState } from "react";
import { useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { KnowledgeSidebar } from "../components/KnowledgeSidebar";
import { KnowledgeHeader } from "../components/KnowledgeHeader";
import { KnowledgeDocumentList } from "../components/KnowledgeDocumentList";

export function KnowledgePage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null,
  );
  const [activeCreatingFolderId, setActiveCreatingFolderId] = useState<
    number | null
  >(null);

  const handleSelectFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(null);
  };

  const handleOpenCreateDocument = () => {
    if (selectedFolderId) {
      setActiveCreatingFolderId(selectedFolderId);
    }
  };

  return (
    <div className="bg-black text-white flex h-[calc(100vh-60px)] font-mono overflow-hidden">
      <KnowledgeSidebar
        subdomain={subdomain}
        projectSlug={projectSlug}
        selectedFolderId={selectedFolderId}
        selectedDocumentId={selectedDocumentId}
        onSelectFolder={handleSelectFolder}
        onSelectDocument={setSelectedDocumentId}
        onCreateDocumentClick={handleOpenCreateDocument}
        activeCreatingFolderId={activeCreatingFolderId}
        setActiveCreatingFolderId={setActiveCreatingFolderId}
      />

      {selectedFolderId ? (
        <KnowledgeDocumentList
          subdomain={subdomain}
          projectSlug={projectSlug}
          folderId={selectedFolderId}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={setSelectedDocumentId}
          onCreateDocument={handleOpenCreateDocument}
        />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
          <KnowledgeHeader />
          <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
            Select a folder from the sidebar to view documents.
          </div>
        </div>
      )}
    </div>
  );
}
