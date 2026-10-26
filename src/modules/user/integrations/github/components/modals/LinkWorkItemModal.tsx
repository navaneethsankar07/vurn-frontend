import { useState } from "react";
import { Loader2, Search, Check, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { WorkItemOptionItem } from "../../types";
import { useInfiniteWorkItemOptions } from "../../api/githubQueries";

interface LinkWorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  onSelectWorkItem: (itemId: number) => void;
  isLinking: boolean;
}

export function LinkWorkItemModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  onSelectWorkItem,
  isLinking,
}: LinkWorkItemModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<WorkItemOptionItem | null>(
    null,
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteWorkItemOptions(subdomain, projectSlug, searchQuery);

  const workItems = data?.pages.flatMap((page) => page.results) || [];

  const handleConfirm = () => {
    if (!selectedItem) return;
    onSelectWorkItem(selectedItem.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-6 space-y-4 [&>button]:rounded-xs">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <Link2 className="h-4 w-4 text-amber-500" />
            <span>Link Existing Work Item</span>
          </DialogTitle>
          <p className="text-[11px] text-zinc-400 font-sans">
            Search and select a work item to link with this GitHub issue.
          </p>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xs pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500/50"
          />
        </div>

        {isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading work items...</span>
          </div>
        ) : workItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 italic">
            No work items found.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-white/10 rounded-xs bg-black/40 p-1.5">
            {workItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`px-3 py-2.5 rounded-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-500/10 border border-amber-500/30 text-white"
                      : "hover:bg-white/5 border border-transparent text-zinc-300"
                  }`}
                >
                  <div className="min-w-0 space-y-0.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-500">
                        {item.key}
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs border border-white/10 bg-white/5 text-zinc-400">
                        {item.status_name}
                      </span>
                    </div>
                    <p className="text-xs font-medium truncate font-sans">
                      {item.title}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-black shrink-0">
                      <Check className="h-3 w-3 stroke-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {hasNextPage && (
              <div className="pt-2 text-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  className="h-7 w-full border-white/10 bg-transparent text-[11px] text-zinc-400 hover:text-white rounded-xs cursor-pointer"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex bg-transparent items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLinking}
            className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs cursor-pointer flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedItem || isLinking}
            onClick={handleConfirm}
            className="h-8 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs gap-1.5 cursor-pointer flex-1"
          >
            {isLinking && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Link Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
