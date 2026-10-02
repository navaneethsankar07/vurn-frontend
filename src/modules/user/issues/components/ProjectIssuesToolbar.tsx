import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@base-ui/react";

interface ProjectIssuesToolbarProps {
  activeTab: "issues" | "epics";
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onOpenFilterModal: () => void;
  activeFilterCount: number;
}

export function ProjectIssuesToolbar({
  activeTab,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onOpenFilterModal,
  activeFilterCount,
}: ProjectIssuesToolbarProps) {
  return (
    <div className="border border-white/10 bg-[#09090B] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xs">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <Input
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyDown={onSearchSubmit}
          placeholder={
            activeTab === "epics"
              ? "Search epics by key, title... (Press Enter)"
              : "Search items by key, title... (Press Enter)"
          }
          className="pl-9 pr-9 h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500/50"
        />
        {searchInput && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onOpenFilterModal}
          className="h-9 px-3 gap-2 bg-black border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs rounded-xs font-mono cursor-pointer relative"
        >
          <Filter className="h-3.5 w-3.5 text-amber-500" />
          <span>Filters & Sort</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-amber-500 text-black text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
