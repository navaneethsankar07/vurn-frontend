import { useState } from "react";
import { MoreHorizontal, X, ArrowLeft, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WORK_ITEM_TYPES } from "../constants";
import type { IssueDetailResponse } from "../types";
import type { WorkflowStatus } from "@/modules/user/projects/types";

interface IssueDetailHeaderProps {
  issue: IssueDetailResponse;
  statuses: WorkflowStatus[];
  isEditingPoints: boolean;
  pointsInput: string;
  onPointsInputChange: (val: string) => void;
  onSavePoints: () => void;
  onCancelPoints: () => void;
  onStartEditingPoints: () => void;
  onStatusChange: (statusId: string | null) => void;
  onClose: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  onDelete?: () => void;
}

export function IssueDetailHeader({
  issue,
  statuses,
  isEditingPoints,
  pointsInput,
  onPointsInputChange,
  onSavePoints,
  onCancelPoints,
  onStartEditingPoints,
  onStatusChange,
  onClose,
  onBack,
  canGoBack = false,
  onDelete,
}: IssueDetailHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSubtask = issue.issue_type === "subtask";
  const typeConfig =
    WORK_ITEM_TYPES.find((t) => t.value === issue.issue_type) ??
    WORK_ITEM_TYPES[2];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40">
      <div className="flex items-center gap-2 min-w-0">
        {canGoBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            title="Back to parent issue"
            className="p-1 -ml-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <TypeIcon
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: typeConfig.color }}
        />
        <span className="font-semibold text-amber-500">{issue.key}</span>
        <span className="text-zinc-600">•</span>

        <Select value={String(issue.status_id)} onValueChange={onStatusChange}>
          <SelectTrigger className="h-6 border border-white/10 bg-black text-white rounded-xs text-[11px] px-2 py-0 focus:ring-1 focus:ring-amber-500 max-w-36">
            <SelectValue>
              <div className="flex items-center gap-1.5 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">{issue.status_name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
          >
            {statuses.map((s) => (
              <SelectItem
                key={s.id}
                value={String(s.id)}
                className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color || "#888888" }}
                  />
                  <span style={{ color: "white" }}>{s.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isSubtask &&
          (isEditingPoints ? (
            <Input
              autoFocus
              value={pointsInput}
              onChange={(e) => onPointsInputChange(e.target.value)}
              onBlur={onSavePoints}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSavePoints();
                if (e.key === "Escape") onCancelPoints();
              }}
              type="number"
              min="0"
              className="h-6 w-14 bg-black border-amber-500 text-white text-[10px] px-1 py-0 rounded-xs"
            />
          ) : (
            <button
              type="button"
              onClick={onStartEditingPoints}
              className="bg-zinc-800 hover:bg-zinc-700 text-[10px] px-1.5 py-0.5 rounded-xs text-zinc-300 transition-colors cursor-pointer"
            >
              {issue.story_points !== null && issue.story_points !== undefined
                ? `${issue.story_points} pt`
                : "+ Points"}
            </button>
          ))}
      </div>

      <div className="flex items-center gap-1 text-zinc-500">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger
            type="button"
            className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={4}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs min-w-max p-1"
          >
            <DropdownMenuItem
              onClick={() => {
                setIsMenuOpen(false);
                onDelete?.();
              }}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 rounded-xs cursor-pointer flex items-center gap-2 py-1.5 px-2.5 whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Delete {typeConfig.label}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
