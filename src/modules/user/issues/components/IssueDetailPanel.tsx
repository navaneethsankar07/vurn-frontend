import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  X,
  MoreHorizontal,
  Paperclip,
  Plus,
  Loader2,
  Tag,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

import { useProjectIssueDetail } from "../api/issueQueries";
import { useProjectWorkflow } from "../../projects/api/projectQueries";
import { useBoardSprints } from "../../sprints/api/sprintQueries";
import { useProjectMembers } from "../../projects/api/projectQueries";
import { useLabelSuggestions } from "../api/issueQueries";
import {
  useUpdateProjectIssue,
  useAddIssueLabel,
  useRemoveIssueLabel,
} from "../api/issueMutations";
import { IssueCommentsSection } from "./IssueCommentsSection";

import { WORK_ITEM_TYPES, WORK_ITEM_PRIORITIES } from "../constants";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { WorkItemPriority, IssueLabel } from "../types";

interface IssueDetailPanelProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  onClose: () => void;
}

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

export function IssueDetailPanel({
  subdomain,
  projectSlug,
  issueId,
  onClose,
}: IssueDetailPanelProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState("");
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [pointsInput, setPointsInput] = useState("");

  const [isEditingEstimateHours, setIsEditingEstimateHours] = useState(false);
  const [estimateHoursInput, setEstimateHoursInput] = useState("");

  const [labelSearch, setLabelSearch] = useState("");
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const pointsInputRef = useRef<HTMLInputElement>(null);
  const estimateHoursInputRef = useRef<HTMLInputElement>(null);

  const {
    data: issue,
    isLoading,
    isError,
  } = useProjectIssueDetail(subdomain, projectSlug, issueId);

  const { data: workflowData } = useProjectWorkflow(subdomain, projectSlug);
  const { data: boardSprints = [] } = useBoardSprints(subdomain, projectSlug);
  const { data: membersResponse } = useProjectMembers(subdomain, projectSlug);
  const { data: labelSuggestions = [] } = useLabelSuggestions(
    subdomain,
    projectSlug,
    { search: labelSearch },
  );

  const { mutate: updateIssue } = useUpdateProjectIssue();
  const { mutate: addLabel, isPending: isAddingLabel } = useAddIssueLabel();
  const { mutate: removeLabel } = useRemoveIssueLabel();

  const statuses = workflowData?.statuses || [];
  const members = membersResponse?.results || [];

  useEffect(() => {
    if (issue) {
      setTitleInput(issue.title || "");
      setDescInput(issue.description || "");
      setPointsInput(
        issue.story_points !== null && issue.story_points !== undefined
          ? String(issue.story_points)
          : "",
      );
      setEstimateHoursInput(
        issue.estimated_time !== null && issue.estimated_time !== undefined
          ? String(issue.estimated_time)
          : "",
      );
    }
  }, [issue]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc) {
      descInputRef.current?.focus();
    }
  }, [isEditingDesc]);

  useEffect(() => {
    if (isEditingPoints) {
      pointsInputRef.current?.focus();
      pointsInputRef.current?.select();
    }
  }, [isEditingPoints]);

  useEffect(() => {
    if (isEditingEstimateHours) {
      estimateHoursInputRef.current?.focus();
      estimateHoursInputRef.current?.select();
    }
  }, [isEditingEstimateHours]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex items-center justify-center font-mono text-xs text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Loading item details...
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 p-6 font-mono text-xs text-red-400 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Error</span>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1 rounded-xs"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p>Failed to load work item details.</p>
        </div>
      </div>
    );
  }

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== issue.title) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { title: trimmed },
      });
    } else {
      setTitleInput(issue.title);
    }
  };

  const handleSaveDesc = () => {
    setIsEditingDesc(false);
    if (descInput !== (issue.description || "")) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { description: descInput },
      });
    }
  };

  const handleSavePoints = () => {
    setIsEditingPoints(false);
    const parsed = pointsInput.trim() === "" ? null : Number(pointsInput);
    if (parsed !== issue.story_points && (parsed === null || !isNaN(parsed))) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { story_points: parsed },
      });
    } else {
      setPointsInput(
        issue.story_points !== null && issue.story_points !== undefined
          ? String(issue.story_points)
          : "",
      );
    }
  };

  const handleSaveEstimateHours = () => {
    setIsEditingEstimateHours(false);
    const trimmed = estimateHoursInput.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (
      parsed !== issue.estimated_time &&
      (parsed === null || (!isNaN(parsed) && parsed >= 0))
    ) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { estimated_time: parsed },
      });
    } else {
      setEstimateHoursInput(
        issue.estimated_time !== null && issue.estimated_time !== undefined
          ? String(issue.estimated_time)
          : "",
      );
    }
  };

  const handleDueDateChange = (newDate: string | null) => {
    updateIssue({
      subdomain,
      projectSlug,
      issueId,
      data: { due_date: newDate },
    });
  };

  const handleStatusChange = (val: string | null) => {
    const status_id = Number(val);
    if (status_id !== issue.status_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { status_id },
      });
    }
  };

  const handlePriorityChange = (val: string | null) => {
    const priority = val as WorkItemPriority;
    if (priority !== issue.priority) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { priority },
      });
    }
  };

  const handleAssigneeChange = (val: string | null) => {
    const assignee_id = val === "unassigned" ? null : Number(val);
    if (assignee_id !== issue.assignee_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { assignee_id },
      });
    }
  };

  const handleSprintChange = (val: string | null) => {
    const sprint_id = val === "none" ? null : Number(val);
    if (sprint_id !== issue.sprint_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId,
        data: { sprint_id },
      });
    }
  };

  const handleAttachExistingLabel = (label: IssueLabel) => {
    addLabel({
      subdomain,
      projectSlug,
      issueId,
      data: { label_id: label.id },
    });
    setLabelSearch("");
    setIsLabelOpen(false);
  };

  const handleCreateAndAttachLabel = () => {
    const trimmed = labelSearch.trim();
    if (!trimmed) return;
    addLabel({
      subdomain,
      projectSlug,
      issueId,
      data: { name: trimmed },
    });
    setLabelSearch("");
    setIsLabelOpen(false);
  };

  const handleRemoveLabel = (labelId: number) => {
    removeLabel({
      subdomain,
      projectSlug,
      issueId,
      labelId,
    });
  };

  const typeConfig =
    WORK_ITEM_TYPES.find((t) => t.value === issue.issue_type) ??
    WORK_ITEM_TYPES[2];
  const TypeIcon = typeConfig.icon;
  const currentPriorityConfig =
    WORK_ITEM_PRIORITIES.find((p) => p.value === issue.priority) ??
    WORK_ITEM_PRIORITIES[2];

  const currentLabels = issue.labels || [];
  const assignedLabelIds = new Set(currentLabels.map((l) => l.id));
  const filteredSuggestions = labelSuggestions.filter(
    (l) => !assignedLabelIds.has(l.id),
  );

  return (
    <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex flex-col font-mono text-white text-xs select-none">
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: typeConfig.color }}
          />
          <span className="font-semibold text-amber-500">{issue.key}</span>
          <span className="text-zinc-600">•</span>

          <Select
            value={String(issue.status_id)}
            onValueChange={handleStatusChange}
          >
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

          {isEditingPoints ? (
            <div className="flex items-center gap-1">
              <Input
                ref={pointsInputRef}
                value={pointsInput}
                onChange={(e) => setPointsInput(e.target.value)}
                onBlur={handleSavePoints}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSavePoints();
                  if (e.key === "Escape") {
                    setIsEditingPoints(false);
                    setPointsInput(
                      issue.story_points !== null &&
                        issue.story_points !== undefined
                        ? String(issue.story_points)
                        : "",
                    );
                  }
                }}
                type="number"
                min="0"
                className="h-6 w-14 bg-black border-amber-500 text-white text-[10px] px-1 py-0 rounded-xs"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingPoints(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-[10px] px-1.5 py-0.5 rounded-xs text-zinc-300 transition-colors"
            >
              {issue.story_points !== null && issue.story_points !== undefined
                ? `${issue.story_points} pt`
                : "+ Points"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-zinc-500">
          <button
            type="button"
            className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:text-white hover:bg-white/5 rounded-xs transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setIsEditingTitle(false);
                  setTitleInput(issue.title);
                }
              }}
              className="bg-black border-amber-500 text-zinc-100 font-sans text-sm font-semibold h-8 rounded-xs px-2"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-zinc-100 font-sans leading-snug cursor-pointer hover:bg-white/5 p-1 rounded-xs transition-colors"
            >
              {issue.title}
            </h2>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Description
            </span>
          </div>
          {isEditingDesc ? (
            <div className="space-y-2">
              <Textarea
                ref={descInputRef}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                rows={5}
                className="bg-black border-amber-500 text-zinc-200 text-xs font-sans rounded-xs p-2.5 resize-y focus-visible:ring-0"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingDesc(false);
                    setDescInput(issue.description || "");
                  }}
                  className="h-7 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white rounded-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveDesc}
                  className="h-7 text-xs bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xs"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingDesc(true)}
              className="text-zinc-300 font-sans text-xs leading-relaxed bg-black/40 p-3 rounded-xs border border-white/5 whitespace-pre-wrap cursor-pointer hover:border-white/20 transition-colors min-h-16"
            >
              {issue.description ? (
                <ReactMarkdown>{issue.description}</ReactMarkdown>
              ) : (
                <span className="text-zinc-600 italic">
                  Click to add a description...
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Information
          </span>
          <div className="divide-y divide-white/5 border border-white/5 bg-black/40 rounded-xs">
            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Status</span>
              <Select
                value={String(issue.status_id)}
                onValueChange={handleStatusChange}
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
              <Select
                value={issue.priority}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0">
                  <SelectValue>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: currentPriorityConfig.color,
                        }}
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
                value={
                  issue.assignee_id ? String(issue.assignee_id) : "unassigned"
                }
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger className="h-6 border-none bg-transparent text-zinc-200 text-xs p-0 focus:ring-0 max-w-44 truncate">
                  <SelectValue>
                    {issue.assignee_name || "Unassigned"}
                  </SelectValue>
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
                onValueChange={handleSprintChange}
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

            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Due Date</span>
              <InlineDatePickerPopover
                value={issue.due_date}
                onChange={handleDueDateChange}
              />
            </div>

            <div className="py-2 px-3 flex items-center justify-between">
              <span className="text-zinc-500">Estimated Hours</span>
              {isEditingEstimateHours ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={estimateHoursInputRef}
                    value={estimateHoursInput}
                    onChange={(e) => setEstimateHoursInput(e.target.value)}
                    onBlur={handleSaveEstimateHours}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEstimateHours();
                      if (e.key === "Escape") {
                        setIsEditingEstimateHours(false);
                        setEstimateHoursInput(
                          issue.estimated_time !== null &&
                            issue.estimated_time !== undefined
                            ? String(issue.estimated_time)
                            : "",
                        );
                      }
                    }}
                    type="number"
                    min="0"
                    placeholder="Hours"
                    className="h-6 w-16 bg-black border-amber-500 text-white text-[10px] px-1 py-0 rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEstimateHours(false);
                      setEstimateHoursInput(
                        issue.estimated_time !== null &&
                          issue.estimated_time !== undefined
                          ? String(issue.estimated_time)
                          : "",
                      );
                    }}
                    className="h-6 px-1 text-zinc-400 hover:text-white text-[10px]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => {
                    setEstimateHoursInput(
                      issue.estimated_time !== null &&
                        issue.estimated_time !== undefined
                        ? String(issue.estimated_time)
                        : "",
                    );
                    setIsEditingEstimateHours(true);
                  }}
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
                  ref={pointsInputRef}
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  onBlur={handleSavePoints}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSavePoints();
                    if (e.key === "Escape") {
                      setIsEditingPoints(false);
                      setPointsInput(
                        issue.story_points !== null &&
                          issue.story_points !== undefined
                          ? String(issue.story_points)
                          : "",
                      );
                    }
                  }}
                  type="number"
                  min="0"
                  className="h-6 w-16 bg-black border-amber-500 text-zinc-200 text-xs px-1 py-0 rounded-xs"
                />
              ) : (
                <span
                  onClick={() => setIsEditingPoints(true)}
                  className="text-zinc-200 cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded-xs transition-colors"
                >
                  {issue.story_points ?? "—"}
                </span>
              )}
            </div>

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

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Labels
            </span>

            <Popover open={isLabelOpen} onOpenChange={setIsLabelOpen}>
              <PopoverTrigger
                type="button"
                className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
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
                  onChange={(e) => setLabelSearch(e.target.value)}
                  placeholder="Find or create label..."
                  className="h-7 text-xs bg-black border-white/10 placeholder:text-zinc-600 rounded-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans"
                />

                <div className="max-h-36 overflow-y-auto space-y-1">
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isAddingLabel}
                      onClick={() => handleAttachExistingLabel(item)}
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
                        l.name.toLowerCase() ===
                        labelSearch.trim().toLowerCase(),
                    ) && (
                      <button
                        type="button"
                        disabled={isAddingLabel}
                        onClick={handleCreateAndAttachLabel}
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
            {currentLabels.length === 0 ? (
              <span className="text-zinc-600 italic text-[11px]">
                No labels attached.
              </span>
            ) : (
              currentLabels.map((l) => (
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
                    onClick={() => handleRemoveLabel(l.id)}
                    className="text-zinc-500 hover:text-red-400 ml-0.5 transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Activity
          </span>
          <div className="space-y-2 text-[11px] text-zinc-400 font-sans">
            <div className="flex items-center justify-between">
              <span>Issue created</span>
              <span className="text-[10px] font-mono text-zinc-600">
                {formatRelativeTime(issue.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status updated to {issue.status_name}</span>
              <span className="text-[10px] font-mono text-zinc-600">
                {formatRelativeTime(issue.updated_at)}
              </span>
            </div>
          </div>
        </div>

        <IssueCommentsSection
          subdomain={subdomain}
          projectSlug={projectSlug}
          issueId={issueId}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Attachments
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors"
            >
              <Paperclip className="h-3 w-3" />
              <span>Attach</span>
            </button>
          </div>
          <div className="p-3 border border-dashed border-white/10 rounded-xs text-center text-zinc-600 text-[11px] font-sans">
            No files attached yet.
          </div>
        </div>
      </div>
    </div>
  );
}
