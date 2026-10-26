import { Plus, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { IssueLabel } from "../types";

interface IssueLabelsCardProps {
  labels: IssueLabel[];
  isLabelOpen: boolean;
  onLabelOpenChange: (open: boolean) => void;
  labelSearch: string;
  onLabelSearchChange: (val: string) => void;
  filteredSuggestions: IssueLabel[];
  isAddingLabel: boolean;
  onAttachExistingLabel: (label: IssueLabel) => void;
  onCreateAndAttachLabel: () => void;
  onRemoveLabel: (id: number) => void;
}

export function IssueLabelsCard({
  labels,
  isLabelOpen,
  onLabelOpenChange,
  labelSearch,
  onLabelSearchChange,
  filteredSuggestions,
  isAddingLabel,
  onAttachExistingLabel,
  onCreateAndAttachLabel,
  onRemoveLabel,
}: IssueLabelsCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Labels
        </span>

        <Popover open={isLabelOpen} onOpenChange={onLabelOpenChange}>
          <PopoverTrigger
            type="button"
            className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 p-2 bg-[#09090B] border border-white/10 text-white rounded-xs font-mono space-y-2"
          >
            <Input
              value={labelSearch}
              onChange={(e) => onLabelSearchChange(e.target.value)}
              placeholder="Find or create label..."
              className="h-7 text-xs bg-black border-white/10 placeholder:text-zinc-600 rounded-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans"
            />

            <div className="max-h-36 overflow-y-auto space-y-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={isAddingLabel}
                  onClick={() => onAttachExistingLabel(item)}
                  className="w-full text-left flex items-center justify-between px-2 py-1 rounded-xs hover:bg-white/10 text-xs transition-colors group"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || "#999999" }}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                </button>
              ))}

              {labelSearch.trim() &&
                !filteredSuggestions.some(
                  (l) =>
                    l.name.toLowerCase() === labelSearch.trim().toLowerCase(),
                ) && (
                  <button
                    type="button"
                    disabled={isAddingLabel}
                    onClick={onCreateAndAttachLabel}
                    className="w-full text-left px-2 py-1 rounded-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Tag className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      Create "{labelSearch.trim()}"
                    </span>
                  </button>
                )}

              {!labelSearch.trim() && filteredSuggestions.length === 0 && (
                <div className="text-zinc-600 text-[10px] text-center py-2">
                  No labels available
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-6">
        {labels.length === 0 ? (
          <span className="text-zinc-600 italic text-[11px]">
            No labels attached.
          </span>
        ) : (
          labels.map((l) => (
            <span
              key={l.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[10px] text-zinc-300 group"
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: l.color || "#999999" }}
              />
              <span>{l.name}</span>
              <button
                type="button"
                onClick={() => onRemoveLabel(l.id)}
                className="text-zinc-500 hover:text-red-400 ml-0.5 transition-colors cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
