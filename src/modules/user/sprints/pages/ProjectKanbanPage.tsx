import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Plus, Loader2, LayoutDashboard, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSubdomain } from "@/utils/subdomain";
import { useKanbanBoard } from "../api/sprintQueries";
import { KanbanColumnComponent } from "../components/KanbanColumnComponent";
import {
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
  KANBAN_SORT_OPTIONS,
} from "../constants";
import type {
  IssuePriority,
  IssueType,
  KanbanColumnIssuesParams,
  KanbanSortOption,
} from "../types";

export function ProjectKanbanPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<KanbanSortOption>("position");

  const {
    data: boardData,
    isLoading: isBoardLoading,
    isError: isBoardError,
  } = useKanbanBoard(subdomain, projectSlug);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const columnFilters: KanbanColumnIssuesParams = {
    search: activeSearch || undefined,
    issue_type: typeFilter !== "all" ? (typeFilter as IssueType) : undefined,
    priority:
      priorityFilter !== "all" ? (priorityFilter as IssuePriority) : undefined,
    sort: sortOption,
  };

  const selectedTypeLabel =
    ISSUE_TYPES.find((t) => t.value === typeFilter)?.label ?? "Type: All";
  const selectedPriorityLabel =
    ISSUE_PRIORITIES.find((p) => p.value === priorityFilter)?.label ??
    "Priority: All";
  const selectedSortLabel =
    KANBAN_SORT_OPTIONS.find((s) => s.value === sortOption)?.label ??
    "Sort: Position";

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8 font-mono flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
              Board
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Visual workflow pipeline and sprint task progress.
          </p>
        </div>

        <Button
          type="button"
          className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs transition-all shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Issue
        </Button>
      </div>

      <div className="border border-white/10 bg-[#09090B] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search issues and press Enter..."
            className="pl-9 pr-9 h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500/50"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={typeFilter}
            onValueChange={(val) => setTypeFilter(val ?? "all")}
          >
            <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
              <SelectValue>{selectedTypeLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
            >
              {ISSUE_TYPES.map((t) => (
                <SelectItem
                  className="rounded-xs"
                  key={t.value}
                  value={t.value}
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(val) => setPriorityFilter(val ?? "all")}
          >
            <SelectTrigger className="w-40 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
              <SelectValue>{selectedPriorityLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
            >
              {ISSUE_PRIORITIES.map((p) => (
                <SelectItem
                  className="rounded-xs"
                  key={p.value}
                  value={p.value}
                >
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(val) =>
              setSortOption((val as KanbanSortOption) ?? "position")
            }
          >
            <SelectTrigger className="w-52 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
              <SelectValue>{selectedSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
            >
              {KANBAN_SORT_OPTIONS.map((s) => (
                <SelectItem
                  className="rounded-xs"
                  key={s.value}
                  value={s.value}
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isBoardLoading ? (
        <div className="min-h-96 flex items-center justify-center text-zinc-400 text-xs border border-white/10 bg-[#09090B] rounded-xs">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
          Loading kanban board...
        </div>
      ) : isBoardError || !boardData ? (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center font-sans rounded-xs">
          Failed to load kanban columns.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start flex-1">
          {boardData.columns
            .sort((a, b) => a.position - b.position)
            .map((col) => (
              <KanbanColumnComponent
                key={col.id}
                subdomain={subdomain}
                projectSlug={projectSlug}
                column={col}
                filters={columnFilters}
              />
            ))}
        </div>
      )}
    </div>
  );
}
