import { useState } from "react";
import {
  Folder,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  X,
  Plus,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateFolderModal } from "./modal/CreateFolderModal";
import { CreateDocumentModal } from "./modal/CreateDocumentModal";
import {
  useDocumentFolders,
  useProjectDocuments,
} from "../api/knowledgeQueries";

interface KnowledgeSidebarProps {
  subdomain: string;
  projectSlug: string;
  selectedFolderId: number | null;
  selectedDocumentId: number | null;
  onSelectFolder: (folderId: number) => void;
  onSelectDocument: (docId: number) => void;
  onCreateDocumentClick: (folderId: number) => void;
  activeCreatingFolderId: number | null;
  setActiveCreatingFolderId: (folderId: number | null) => void;
}

export function KnowledgeSidebar({
  subdomain,
  projectSlug,
  selectedFolderId,
  selectedDocumentId,
  onSelectFolder,
  onSelectDocument,
  activeCreatingFolderId,
  setActiveCreatingFolderId,
}: KnowledgeSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: folderData, isLoading: isFoldersLoading } = useDocumentFolders(
    subdomain,
    projectSlug,
    { search: activeSearch || undefined },
  );

  const folders = folderData?.results || [];

  const { data: docData } = useProjectDocuments(subdomain, projectSlug, {
    folder_id: selectedFolderId || undefined,
  });

  const documents = docData?.results || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#09090B] border-r border-white/10 flex flex-col items-center py-3 gap-4 font-mono select-none">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          title="Expand sidebar"
          className="p-1.5 text-zinc-400 hover:text-white rounded-xs hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsCreateFolderOpen(true)}
          title="New Folder"
          className="p-1.5 text-amber-500 hover:text-amber-400 rounded-xs hover:bg-white/5 transition-colors cursor-pointer"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#09090B] border-r border-white/10 flex flex-col font-mono select-none shrink-0">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Knowledge Base
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCreateFolderOpen(true)}
            title="New Folder"
            className="p-1 text-amber-500 hover:text-amber-400 rounded-xs hover:bg-white/5 transition-colors cursor-pointer"
          >
            <FolderPlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            title="Collapse sidebar"
            className="p-1 text-zinc-400 hover:text-white rounded-xs hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-2 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search folders..."
            className="pl-8 pr-7 h-7 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-[11px]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {isCreateFolderOpen && (
        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          onClose={() => setIsCreateFolderOpen(false)}
          subdomain={subdomain}
          projectSlug={projectSlug}
        />
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isFoldersLoading ? (
          <div className="py-8 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
            <span>Loading...</span>
          </div>
        ) : folders.length === 0 ? (
          <div className="p-4 text-center text-zinc-600 text-[11px]">
            No folders found.
          </div>
        ) : (
          folders.map((folder) => {
            const isFolderSelected = selectedFolderId === folder.id;
            return (
              <div key={folder.id} className="space-y-1">
                <div
                  onClick={() => onSelectFolder(folder.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer text-xs ${
                    isFolderSelected
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "hover:bg-white/5 text-zinc-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Folder className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFolder(folder.id);
                      setActiveCreatingFolderId(folder.id);
                    }}
                    title="New Document in Folder"
                    className="p-1 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-amber-400 rounded-xs transition-opacity cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {isFolderSelected && (
                  <div className="pl-5 space-y-1 pb-1">
                    {activeCreatingFolderId === folder.id && (
                      <CreateDocumentModal
                        isOpen={true}
                        onClose={() => setActiveCreatingFolderId(null)}
                        subdomain={subdomain}
                        projectSlug={projectSlug}
                        folderId={folder.id}
                      />
                    )}

                    {documents.map((doc) => {
                      const isDocSelected = selectedDocumentId === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => onSelectDocument(doc.id)}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-xs ${
                            isDocSelected
                              ? "bg-amber-500/15 text-white font-semibold"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <FileText className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="truncate">{doc.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
