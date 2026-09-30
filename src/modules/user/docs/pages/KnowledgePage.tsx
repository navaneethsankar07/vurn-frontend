import { useState } from "react";
import { useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { KnowledgeSidebar } from "../components/KnowledgeSidebar";
import { KnowledgeMainContent } from "../components/KnowledgeMainContent";

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

  const handleDocumentCreated = (docId: number) => {
    setSelectedDocumentId(docId);
    setActiveCreatingFolderId(null);
  };

  return (
    <div className="bg-black text-white flex h-170 font-mono overflow-hidden">
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
        onDocumentCreated={handleDocumentCreated}
      />

      <KnowledgeMainContent
        subdomain={subdomain}
        projectSlug={projectSlug}
        selectedFolderId={selectedFolderId}
        selectedDocumentId={selectedDocumentId}
      />
    </div>
  );
}
