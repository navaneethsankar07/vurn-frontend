import { X, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WORK_ITEM_PRIORITIES, WORK_ITEM_SORT_OPTIONS } from "../../constants";
import type { WorkflowStatus } from "@/modules/user/projects/types";

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "issues" | "epics";
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
  assigneeFilter: string;
  onAssigneeFilterChange: (val: string | null) => void;
  selectedAssigneeLabel: string;
  members: any[];
  isUserProjectLead: boolean;
  currentUserId?: number | null;
  sortOption: string;
  onSortOptionChange: (val: string | null) => void;
  selectedSortLabel: string;
  onReset: () => void;
}

export function FilterSortModal({
  isOpen,
  onClose,
  activeTab,
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
  assigneeFilter,
  onAssigneeFilterChange,
  selectedAssigneeLabel,
  members,
  isUserProjectLead,
  currentUserId,
  sortOption,
  onSortOptionChange,
  selectedSortLabel,
  onReset,
}: FilterSortModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-sm rounded-xs shadow-2xl p-4 space-y-4">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3 space-y-0">
          <DialogTitle className="text-xs font-bold uppercase tracking-wider text-white">
            Filters & Sorting
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {activeTab === "issues" && (
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
                Type
              </label>
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="w-full h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
                  <SelectValue>{selectedTypeLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="bg-[#09090B] border-white/10 text-zinc-300 font-mono rounded-xs text-xs"
                >
                  <SelectItem
                    value="all"
                    className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                  >
                    Type: All
                  </SelectItem>
                  {nonEpicTypes.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
              Priority
            </label>
            <Select
              value={priorityFilter}
              onValueChange={onPriorityFilterChange}
            >
              <SelectTrigger className="w-full h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
                <SelectValue>{selectedPriorityLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-zinc-300 font-mono rounded-xs text-xs"
              >
                <SelectItem
                  value="all"
                  className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                >
                  Priority: All
                </SelectItem>
                {WORK_ITEM_PRIORITIES.map((p) => (
                  <SelectItem
                    key={p.value}
                    value={p.value}
                    className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
              Status
            </label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
                <SelectValue>{selectedStatusLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-zinc-300 font-mono rounded-xs text-xs"
              >
                <SelectItem
                  value="all"
                  className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                >
                  Status: All
                </SelectItem>
                {statuses.map((s) => (
                  <SelectItem
                    key={s.id}
                    value={String(s.id)}
                    className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
              Assignee
            </label>
            <Select
              value={assigneeFilter}
              onValueChange={onAssigneeFilterChange}
            >
              <SelectTrigger className="w-full h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
                <SelectValue>{selectedAssigneeLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-zinc-300 font-mono rounded-xs text-xs"
              >
                <SelectItem
                  value="all"
                  className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                >
                  Assignee: All
                </SelectItem>
                {isUserProjectLead
                  ? members.map((m: any) => {
                      const memberId = String(m.user_id || m.id);
                      const memberName = m.full_name || m.name || "Member";
                      return (
                        <SelectItem
                          key={memberId}
                          value={memberId}
                          className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                        >
                          {memberName}
                        </SelectItem>
                      );
                    })
                  : currentUserId && (
                      <SelectItem
                        value={String(currentUserId)}
                        className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                      >
                        Assigned to you
                      </SelectItem>
                    )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 pt-2 border-t border-white/10">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wide">
              Sort By
            </label>
            <Select value={sortOption} onValueChange={onSortOptionChange}>
              <SelectTrigger className="w-full h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-xs">
                <SelectValue>{selectedSortLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-zinc-300 font-mono rounded-xs text-xs"
              >
                {WORK_ITEM_SORT_OPTIONS.map((s) => (
                  <SelectItem
                    key={s.value}
                    value={s.value}
                    className="text-xs text-zinc-300 rounded-xs focus:bg-white/10 focus:text-white"
                  >
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
