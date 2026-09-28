import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WORK_ITEM_PRIORITIES } from "../constants";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { IssueDetailResponse } from "../types";
import type { WorkflowStatus } from "@/modules/user/projects/types";
import type { BoardSprintOption } from "@/modules/user/sprints/types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function InlineDatePickerPopover({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (val: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentOrPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="flex items-center gap-1.5 text-zinc-200 hover:text-white hover:bg-white/5 px-1 py-0.5 rounded-xs transition-colors cursor-pointer"
      >
        <CalendarIcon className="h-3 w-3 text-zinc-500" />
        <span>{value ? value.split("T")[0] : "Set date"}</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-3 bg-[#09090B] border border-white/10 text-white rounded-xs font-mono shadow-2xl space-y-3"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-semibold text-zinc-200">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isCurrentOrPastMonth}
              onClick={handlePrevMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 font-semibold">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const targetDate = new Date(viewYear, viewMonth, day);
            const isPastOrToday = targetDate <= today;
            const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = value?.startsWith(formatted);

            return (
              <button
                key={day}
                type="button"
                disabled={isPastOrToday}
                onClick={() => handleSelectDay(day)}
                className={`h-7 w-7 rounded-xs flex items-center justify-center text-xs transition-colors ${
                  isPastOrToday
                    ? "text-zinc-600 cursor-not-allowed opacity-40"
                    : isSelected
                      ? "bg-amber-500 text-black font-semibold"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {value && (
          <div className="pt-2 border-t border-white/5 text-right">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear date
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface IssueInfoCardProps {
  issue: IssueDetailResponse;
  statuses: WorkflowStatus[];
  members: any[];
  boardSprints: BoardSprintOption[];
  epics: any[];
  onStatusChange: (val: string | null) => void;
  onPriorityChange: (val: string | null) => void;
  onAssigneeChange: (val: string | null) => void;
  onSprintChange: (val: string | null) => void;
  onParentChange: (val: string | null) => void;
  onDueDateChange: (val: string | null) => void;
  isEditingEstimateHours: boolean;
  estimateHoursInput: string;
  onEstimateHoursInputChange: (val: string) => void;
  onSaveEstimateHours: () => void;
  onCancelEstimateHours: () => void;
  onStartEditingEstimateHours: () => void;
  isEditingPoints: boolean;
  pointsInput: string;
  onPointsInputChange: (val: string) => void;
  onSavePoints: () => void;
  onCancelPoints: () => void;
  onStartEditingPoints: () => void;
}

export function IssueInfoCard({
  issue,
  statuses,
  members,
  boardSprints,
  epics,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSprintChange,
  onParentChange,
  onDueDateChange,
  isEditingEstimateHours,
  estimateHoursInput,
  onEstimateHoursInputChange,
  onSaveEstimateHours,
  onCancelEstimateHours,
  onStartEditingEstimateHours,
  isEditingPoints,
  pointsInput,
  onPointsInputChange,
  onSavePoints,
  onCancelPoints,
  onStartEditingPoints,
}: IssueInfoCardProps) {
  const isSubtask = issue.issue_type === "subtask";
  const isEpic = issue.issue_type === "epic";
  const currentPriorityConfig =
    WORK_ITEM_PRIORITIES.find((p) => p.value === issue.priority) ??
    WORK_ITEM_PRIORITIES[2];

  const activeEpic = epics.find((e) => e.id === issue.parent_id);

  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
        Information
      </span>
      <div className="divide-y divide-white/5 border border-white/5 bg-black/40 rounded-xs">
        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Status</span>
          <Select
            value={String(issue.status_id)}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0">
              <SelectValue>{issue.status_name}</SelectValue>
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
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Priority</span>
          <Select value={issue.priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0">
              <SelectValue>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentPriorityConfig.color }}
                  />
                  <span className="capitalize">{issue.priority}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
            >
              {WORK_ITEM_PRIORITIES.map((p) => (
                <SelectItem
                  key={p.value}
                  value={p.value}
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span>{p.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Assignee</span>
          <Select
            value={issue.assignee_id ? String(issue.assignee_id) : "unassigned"}
            onValueChange={onAssigneeChange}
          >
            <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0 max-w-44 truncate">
              <SelectValue>{issue.assignee_name || "Unassigned"}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs max-h-56"
            >
              <SelectItem
                value="unassigned"
                className="cursor-pointer text-zinc-400 focus:bg-white/10 focus:text-white"
              >
                Unassigned
              </SelectItem>
              {members.map((m: any) => (
                <SelectItem
                  key={m.id || m.user_id}
                  value={String(m.user_id)}
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                >
                  {m.full_name ||
                    m.user?.name ||
                    m.user?.email ||
                    `User #${m.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Reporter</span>
          <span className="text-zinc-200">
            {issue.reporter_name || "System"}
          </span>
        </div>

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Sprint</span>
          <Select
            value={issue.sprint_id ? String(issue.sprint_id) : "none"}
            onValueChange={onSprintChange}
          >
            <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0 max-w-44 truncate">
              <SelectValue>{issue.sprint_name || "Backlog"}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              alignItemWithTrigger={false}
              className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs max-h-56"
            >
              <SelectItem
                value="none"
                className="cursor-pointer text-zinc-400 focus:bg-white/10 focus:text-white"
              >
                Backlog
              </SelectItem>
              {boardSprints.map((s) => (
                <SelectItem
                  key={s.id}
                  value={String(s.id)}
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isSubtask && !isEpic && (
          <div className="py-2 px-3 flex items-center justify-between">
            <span className="text-zinc-500">Parent Epic</span>
            <Select
              value={issue.parent_id ? String(issue.parent_id) : "none"}
              onValueChange={onParentChange}
            >
              <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0 max-w-44 truncate">
                <SelectValue>
                  {activeEpic
                    ? `${activeEpic.key}: ${activeEpic.title}`
                    : "None"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                align="end"
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs w-72 max-h-56 overflow-y-auto"
              >
                <SelectItem
                  value="none"
                  className="cursor-pointer text-zinc-400 focus:bg-white/10 focus:text-white"
                >
                  None
                </SelectItem>
                {epics.map((e) => (
                  <SelectItem
                    key={e.id}
                    value={String(e.id)}
                    className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-amber-500 font-semibold shrink-0">
                        {e.key}:
                      </span>
                      <span className="truncate">{e.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!isSubtask && (
          <>
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Due Date</span>
              <InlineDatePickerPopover
                value={issue.due_date}
                onChange={onDueDateChange}
              />
            </div>

            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Estimated Hours</span>
              {isEditingEstimateHours ? (
                <Input
                  autoFocus
                  value={estimateHoursInput}
                  onChange={(e) => onEstimateHoursInputChange(e.target.value)}
                  onBlur={onSaveEstimateHours}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveEstimateHours();
                    if (e.key === "Escape") onCancelEstimateHours();
                  }}
                  type="number"
                  min="0"
                  placeholder="Hours"
                  className="h-6 w-16 bg-black border-amber-500 text-white text-[10px] px-1 py-0 rounded-xs"
                />
              ) : (
                <span
                  onClick={onStartEditingEstimateHours}
                  className="text-zinc-200 cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded-xs transition-colors"
                >
                  {issue.estimated_time !== null &&
                  issue.estimated_time !== undefined
                    ? `${issue.estimated_time}h`
                    : "—"}
                </span>
              )}
            </div>

            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Story Points</span>
              {isEditingPoints ? (
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
                  placeholder="Points"
                  className="h-6 w-16 bg-black border-amber-500 text-white text-[10px] px-1 py-0 rounded-xs"
                />
              ) : (
                <span
                  onClick={onStartEditingPoints}
                  className="text-zinc-200 cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded-xs transition-colors"
                >
                  {issue.story_points !== null &&
                  issue.story_points !== undefined
                    ? `${issue.story_points} pt`
                    : "—"}
                </span>
              )}
            </div>
          </>
        )}

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Created</span>
          <span className="text-zinc-200">
            {formatRelativeTime(issue.created_at, "")}
          </span>
        </div>

        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-zinc-500">Last Updated</span>
          <span className="text-zinc-200">
            {formatRelativeTime(issue.updated_at, "")}
          </span>
        </div>
      </div>
    </div>
  );
}
