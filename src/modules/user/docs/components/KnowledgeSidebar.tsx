import { useState } from "react";
import {
  Folder,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateFolderModal } from "./modal/CreateFolderModal";
import { useDocumentFolders } from "../api/knowledgeQueries";

interface KnowledgeSidebarProps {
  subdomain: string;
  projectSlug: string;
}

export function KnowledgeSidebar({
  subdomain,
  projectSlug,
}: KnowledgeSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading } = useDocumentFolders(subdomain, projectSlug, {
    search: activeSearch || undefined,
  });

  const folders = data?.results || [];

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
          onClick={() => setIsCreateModalOpen(true)}
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
            onClick={() => setIsCreateModalOpen(true)}
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

      {isCreateModalOpen && (
        <CreateFolderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          subdomain={subdomain}
          projectSlug={projectSlug}
        />
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="py-8 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
            <span>Loading...</span>
          </div>
        ) : folders.length === 0 ? (
          <div className="p-4 text-center text-zinc-600 text-[11px]">
            No folders found.
          </div>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              className="group flex items-center justify-between px-2.5 py-1.5 rounded-xs hover:bg-white/5 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <Folder className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{folder.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
