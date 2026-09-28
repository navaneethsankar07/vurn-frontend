import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WORK_ITEM_PRIORITIES, WORK_ITEM_SORT_OPTIONS } from "../constants";
import type { WorkflowStatus } from "@/modules/user/projects/types";

interface ProjectIssuesToolbarProps {
  activeTab: "issues" | "epics";
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  typeFilter: string;
  onTypeFilterChange: (val: string | null) => void;
  selectedTypeLabel: string;
  nonEpicTypes: { value: string; label: string }[];
  priorityFilter: string;
  onPriorityFilterChange: (val: string | null) => void;
  selectedPriorityLabel: string;
  statusFilter: string;
  onStatusFilterChange: (val: string | null) => void;
  selectedStatusLabel: string;
  statuses: WorkflowStatus[];
  sortOption: string;
  onSortOptionChange: (val: string | null) => void;
  selectedSortLabel: string;
}

export function ProjectIssuesToolbar({
  activeTab,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  typeFilter,
  onTypeFilterChange,
  selectedTypeLabel,
  nonEpicTypes,
  priorityFilter,
  onPriorityFilterChange,
  selectedPriorityLabel,
  statusFilter,
  onStatusFilterChange,
  selectedStatusLabel,
  statuses,
  sortOption,
  onSortOptionChange,
  selectedSortLabel,
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

      <div className="flex items-center gap-2 flex-wrap">
        {activeTab === "issues" && (
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
              <SelectValue>{selectedTypeLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
            >
              <SelectItem value="all">Type: All</SelectItem>
              {nonEpicTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
            <SelectValue>{selectedPriorityLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
          >
            <SelectItem value="all">Priority: All</SelectItem>
            {WORK_ITEM_PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
            <SelectValue>{selectedStatusLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
          >
            <SelectItem value="all">Status: All</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={onSortOptionChange}>
          <SelectTrigger className="w-48 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
            <SelectValue>{selectedSortLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
          >
            {WORK_ITEM_SORT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
