import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Loader2,
  LayoutDashboard,
  X,
  Layers,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { getSubdomain } from "@/utils/subdomain";
import { useKanbanBoard, useBoardSprints } from "../api/sprintQueries";
import { useProjectEpics } from "../../issues/api/issueQueries";
import { KanbanColumnComponent } from "../components/KanbanColumnComponent";
import { CreateIssueModal } from "../../issues/components/modals/CreateIssueModal";
import { useModal } from "@/hooks/useModal";
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
import type { WorkflowStatus } from "@/modules/user/projects/types";

export function ProjectKanbanPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [selectedParentId, setSelectedParentId] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<KanbanSortOption>("position");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [defaultCreateStatusId, setDefaultCreateStatusId] = useState<
    number | undefined
  >(undefined);

  const createIssueModal = useModal();

  const {
    data: boardData,
    isLoading: isBoardLoading,
    isError: isBoardError,
  } = useKanbanBoard(subdomain, projectSlug);

  const { data: boardSprints = [], isLoading: isSprintsLoading } =
    useBoardSprints(subdomain, projectSlug);

  const { data: epicsData, isLoading: isEpicsLoading } = useProjectEpics(
    subdomain,
    projectSlug,
  );
  const epics = epicsData?.results || [];

  useEffect(() => {
    if (!selectedSprintId && boardSprints.length > 0) {
      const activeSprint = boardSprints.find((s) => s.status === "active");
      if (activeSprint) {
        setSelectedSprintId(String(activeSprint.id));
      } else {
        setSelectedSprintId("all");
      }
    }
  }, [boardSprints, selectedSprintId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const handleClearAllFilters = () => {
    setTypeFilter("all");
    setPriorityFilter("all");
    setSortOption("position");
  };

  const columnFilters: KanbanColumnIssuesParams = {
    search: activeSearch || undefined,
    sprint_id:
      selectedSprintId && selectedSprintId !== "all"
        ? selectedSprintId
        : undefined,
    parent_id: selectedParentId !== "all" ? selectedParentId : undefined,
    issue_type: typeFilter !== "all" ? (typeFilter as IssueType) : undefined,
    priority:
      priorityFilter !== "all" ? (priorityFilter as IssuePriority) : undefined,
    sort: sortOption,
  };

  const selectedSprintName =
    selectedSprintId === "all"
      ? "All Sprints"
      : (boardSprints.find((s) => String(s.id) === selectedSprintId)?.name ??
        "All Sprints");

  const activeEpic = epics.find((e) => String(e.id) === selectedParentId);
  const selectedEpicName =
    selectedParentId === "all"
      ? "All Epics"
      : activeEpic
        ? `${activeEpic.key}: ${activeEpic.title}`
        : "All Epics";

  const filteredIssueTypes = ISSUE_TYPES.filter(
    (t) =>
      t.value === "all" ||
      (t.value !== "epic" && t.value !== "story" && t.value !== "subtask"),
  );

  const activeFiltersCount =
    (typeFilter !== "all" ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0) +
    (sortOption !== "position" ? 1 : 0);

  const statuses: WorkflowStatus[] =
    boardData?.columns.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category as any,
      color: c.color,
      is_default: defaultCreateStatusId
        ? c.id === defaultCreateStatusId
        : false,
      position: c.position,
      icon: "",
      is_archived: false,
      allow_from_backlog: true,
      allow_incoming: true,
      allow_outgoing: true,
    })) || [];

  return (
    <div className="bg-black fixed text-white p-4 lg:w-380 sm:p-6 lg:p-0 font-mono flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-amber-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Board
              </h1>
            </div>

            <span className="text-zinc-600">/</span>

            <Select
              value={selectedSprintId}
              onValueChange={(val) => setSelectedSprintId(val ?? "all")}
              disabled={isSprintsLoading}
            >
              <SelectTrigger className="h-7 border border-white/10 bg-[#09090B] text-xs text-zinc-200 px-2.5 gap-2 rounded-xs hover:border-white/20 hover:text-white transition-colors focus:ring-0 focus:ring-offset-0 cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold">{selectedSprintName}</span>
                </div>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                align="start"
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs min-w-44"
              >
                <SelectItem
                  className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                  value="all"
                >
                  All Sprints
                </SelectItem>
                {boardSprints.map((sprint) => (
                  <SelectItem
                    className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                    key={sprint.id}
                    value={String(sprint.id)}
                  >
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-zinc-600">/</span>

            <Select
              value={selectedParentId}
              onValueChange={(val) => setSelectedParentId(val ?? "all")}
              disabled={isEpicsLoading}
            >
              <SelectTrigger className="h-7 border border-white/10 bg-[#09090B] text-xs text-zinc-200 px-2.5 gap-2 rounded-xs hover:border-white/20 hover:text-white transition-colors focus:ring-0 focus:ring-offset-0 cursor-pointer max-w-56">
                <div className="flex items-center gap-1.5 truncate">
                  <Compass className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold truncate">
                    {selectedEpicName}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                align="start"
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs min-w-56"
              >
                <SelectItem
                  className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                  value="all"
                >
                  All Epics
                </SelectItem>
                {epics.map((epic) => (
                  <SelectItem
                    className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                    key={epic.id}
                    value={String(epic.id)}
                  >
                    <span className="text-amber-500 font-semibold mr-1.5">
                      {epic.key}:
                    </span>
                    <span className="truncate">{epic.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-zinc-400">
            Visual workflow pipeline and sprint task progress.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setDefaultCreateStatusId(undefined);
            createIssueModal.openModal();
          }}
          className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Issue
        </Button>
      </div>

      <div className="border border-white/10 bg-[#09090B] p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xs">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger
              type="button"
              className="h-9 px-3 border border-white/10 bg-black text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xs text-xs gap-2 font-mono transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
              <span>Filter & Sort</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-black font-bold text-[10px] rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-72 p-4 bg-[#09090B] border border-white/10 text-white rounded-xs shadow-2xl font-mono space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Board Filters
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-[10px] text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Reset all
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400">Type</label>
                  <Select
                    value={typeFilter}
                    onValueChange={(val) => setTypeFilter(val ?? "all")}
                  >
                    <SelectTrigger className="w-full h-8 border-white/10 bg-black text-zinc-200 rounded-xs cursor-pointer text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      sideOffset={4}
                      alignItemWithTrigger={false}
                      className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
                    >
                      {filteredIssueTypes.map((t) => (
                        <SelectItem
                          className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                          key={t.value}
                          value={t.value}
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400">Priority</label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(val) => setPriorityFilter(val ?? "all")}
                  >
                    <SelectTrigger className="w-full h-8 border-white/10 bg-black text-zinc-200 rounded-xs cursor-pointer text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      sideOffset={4}
                      alignItemWithTrigger={false}
                      className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
                    >
                      {ISSUE_PRIORITIES.map((p) => (
                        <SelectItem
                          className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
                          key={p.value}
                          value={p.value}
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400">Sort By</label>
                  <Select
                    value={sortOption}
                    onValueChange={(val) =>
                      setSortOption((val as KanbanSortOption) ?? "position")
                    }
                  >
                    <SelectTrigger className="w-full h-8 border-white/10 bg-black text-zinc-200 rounded-xs cursor-pointer text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      sideOffset={4}
                      alignItemWithTrigger={false}
                      className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs"
                    >
                      {KANBAN_SORT_OPTIONS.map((s) => (
                        <SelectItem
                          className="rounded-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white"
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
            </PopoverContent>
          </Popover>
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
                onAddIssue={(statusId) => {
                  setDefaultCreateStatusId(statusId);
                  createIssueModal.openModal();
                }}
              />
            ))}
        </div>
      )}

      <CreateIssueModal
        isOpen={createIssueModal.isOpen}
        onClose={createIssueModal.closeModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        statuses={statuses}
        sprints={boardSprints}
        parentCandidates={epics.map((e) => ({
          id: e.id,
          key: e.key,
          title: e.title,
          issue_type: e.issue_type,
        }))}
        defaultType="task"
        defaultSprintId={
          selectedSprintId && selectedSprintId !== "all"
            ? selectedSprintId
            : undefined
        }
        defaultParentId={
          selectedParentId && selectedParentId !== "all"
            ? selectedParentId
            : undefined
        }
      />
    </div>
  );
}
