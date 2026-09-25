import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Layers,
  ChevronDown,
  Plus,
  Search,
  X,
  Loader2,
  Zap,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/useModal";
import { getSubdomain } from "@/utils/subdomain";
import { useProjectWorkflow } from "../../projects/api/projectQueries";
import { useBoardSprints } from "../../sprints/api/sprintQueries";
import { useProjectIssues } from "../api/issueQueries";
import { CreateIssueModal } from "../components/modals/CreateIssueModal";
import { WorkItemsTable } from "../components/WorkItemsTable";
import {
  WORK_ITEM_TYPES,
  WORK_ITEM_PRIORITIES,
  WORK_ITEM_SORT_OPTIONS,
} from "../constants";
import type {
  WorkItemType,
  WorkItemPriority,
  IssueListParams,
  IssueItem,
} from "../types";

export function ProjectIssuesPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subdomain = getSubdomain() || "";

  const [activeTab, setActiveTab] = useState<"issues" | "epics">("issues");
  const [selectedCreationType, setSelectedCreationType] =
    useState<WorkItemType>("task");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sprintFilter, setSprintFilter] = useState<string>("all");
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("created_desc");
  const [currentPage, setCurrentPage] = useState(1);

  const createModal = useModal();

  const { data: workflowData } = useProjectWorkflow(subdomain, projectSlug);
  const { data: boardSprints = [] } = useBoardSprints(subdomain, projectSlug);

  const { data: epicsData } = useProjectIssues(subdomain, projectSlug, {
    issue_type: "epic",
    page_size: 100,
  });

  const availableEpics = epicsData?.results || [];

  const queryParams: IssueListParams = {
    search: activeSearch || undefined,
    issue_type:
      activeTab === "epics"
        ? "epic"
        : typeFilter !== "all"
          ? (typeFilter as WorkItemType)
          : undefined,
    parent_id:
      activeTab === "issues" && selectedEpicFilter !== "all"
        ? selectedEpicFilter
        : undefined,
    priority:
      priorityFilter !== "all"
        ? (priorityFilter as WorkItemPriority)
        : undefined,
    status_id: statusFilter !== "all" ? statusFilter : undefined,
    sprint_id:
      activeTab === "issues" && sprintFilter !== "all"
        ? sprintFilter
        : undefined,
    sort: sortOption,
    page: currentPage,
    page_size: 20,
  };

  const {
    data: issuesData,
    isLoading,
    isError,
  } = useProjectIssues(subdomain, projectSlug, queryParams);

  const statuses = workflowData?.statuses || [];
  const rawResults = issuesData?.results || [];
  const issues =
    activeTab === "issues" && typeFilter === "all"
      ? rawResults.filter((i) => i.issue_type !== "epic")
      : rawResults;

  const totalCount =
    activeTab === "issues" && typeFilter === "all"
      ? Math.max(0, (issuesData?.count || 0) - availableEpics.length)
      : issuesData?.count || 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleOpenCreateWithType = (type: WorkItemType) => {
    setSelectedCreationType(type);
    createModal.openModal();
  };

  const handleSelectIssue = (item: IssueItem) => {
    searchParams.set("selectedIssue", String(item.id));
    setSearchParams(searchParams);
  };

  const nonEpicTypes = WORK_ITEM_TYPES.filter((t) => t.value !== "epic");

  const selectedTypeLabel =
    typeFilter === "all"
      ? "Type: All"
      : (nonEpicTypes.find((t) => t.value === typeFilter)?.label ??
        "Type: All");

  const selectedPriorityLabel =
    priorityFilter === "all"
      ? "Priority: All"
      : (WORK_ITEM_PRIORITIES.find((p) => p.value === priorityFilter)?.label ??
        "Priority: All");

  const selectedStatusLabel =
    statusFilter === "all"
      ? "Status: All"
      : (statuses.find((s) => String(s.id) === statusFilter)?.name ??
        "Status: All");

  const selectedSprintLabel =
    sprintFilter === "all"
      ? "All Sprints"
      : (boardSprints.find((s) => String(s.id) === sprintFilter)?.name ??
        "Sprint Scope");

  const selectedEpicLabel =
    selectedEpicFilter === "all"
      ? "All Epics"
      : (availableEpics.find((e) => String(e.id) === selectedEpicFilter)
          ?.title ?? "Epic Scope");

  const selectedSortLabel =
    WORK_ITEM_SORT_OPTIONS.find((s) => s.value === sortOption)?.label ??
    "Created Newest";

  return (
    <div className="bg-black text-white h-full font-mono flex flex-col gap-4 overflow-hidden">
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-500" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Work Items
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-white/10 bg-black p-0.5 rounded-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("issues");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-semibold uppercase transition-colors rounded-xs ${
                    activeTab === "issues"
                      ? "bg-amber-500 text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Issues & Tasks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("epics");
                    setTypeFilter("all");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-semibold uppercase transition-colors rounded-xs ${
                    activeTab === "epics"
                      ? "bg-amber-500 text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Epics ({availableEpics.length})
                </button>
              </div>

              {activeTab === "issues" && (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#09090B] border border-white/10 rounded-xs">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                      Sprint:
                    </span>
                    <Select
                      value={sprintFilter}
                      onValueChange={(val) => {
                        setSprintFilter(val ?? "all");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-6 border-none bg-transparent text-xs text-white p-0 gap-1.5 focus:ring-0 focus:ring-offset-0 font-semibold hover:text-amber-400 transition-colors">
                        <SelectValue>{selectedSprintLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={6}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs min-w-44"
                      >
                        <SelectItem className="rounded-xs" value="all">
                          All Sprints
                        </SelectItem>
                        {boardSprints.map((s) => (
                          <SelectItem
                            className="rounded-xs"
                            key={s.id}
                            value={String(s.id)}
                          >
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#09090B] border border-white/10 rounded-xs">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                      Epic:
                    </span>
                    <Select
                      value={selectedEpicFilter}
                      onValueChange={(val) => {
                        setSelectedEpicFilter(val ?? "all");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-6 border-none bg-transparent text-xs text-white p-0 gap-1.5 focus:ring-0 focus:ring-offset-0 font-semibold hover:text-amber-400 transition-colors max-w-40">
                        <SelectValue className="truncate">
                          {selectedEpicLabel}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={6}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs text-xs min-w-48"
                      >
                        <SelectItem className="rounded-xs" value="all">
                          All Epics
                        </SelectItem>
                        {availableEpics.map((e) => (
                          <SelectItem
                            className="rounded-xs"
                            key={e.id}
                            value={String(e.id)}
                          >
                            <span className="text-amber-500 font-semibold mr-1">
                              {e.key}:
                            </span>
                            <span className="truncate">{e.title}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Button
              type="button"
              onClick={() =>
                handleOpenCreateWithType(
                  activeTab === "epics" ? "epic" : "task",
                )
              }
              className="h-9 gap-1.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-l-xs rounded-r-none transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {activeTab === "epics" ? "Create Epic" : "Create Work Item"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="h-9 px-2 bg-amber-500 hover:bg-amber-400 text-black border-l border-black/20 rounded-r-xs rounded-l-none inline-flex items-center justify-center transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="bg-[#09090B] border-white/10 text-white font-mono min-w-44 rounded-xs"
              >
                {WORK_ITEM_TYPES.filter((t) => t.value !== "subtask").map(
                  (t) => {
                    const Icon = t.icon;
                    return (
                      <DropdownMenuItem
                        key={t.value}
                        onClick={() => handleOpenCreateWithType(t.value)}
                        className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-xs font-sans flex items-center gap-2 py-2"
                      >
                        <Icon
                          className="h-3.5 w-3.5"
                          style={{ color: t.color }}
                        />
                        <span>Create {t.label}</span>
                      </DropdownMenuItem>
                    );
                  },
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border border-white/10 bg-[#09090B] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === "issues" && (
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val ?? "all");
                  setCurrentPage(1);
                }}
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
                  <SelectItem value="all">Type: All</SelectItem>
                  {nonEpicTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={priorityFilter}
              onValueChange={(val) => {
                setPriorityFilter(val ?? "all");
                setCurrentPage(1);
              }}
            >
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

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val ?? "all");
                setCurrentPage(1);
              }}
            >
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

            <Select
              value={sortOption}
              onValueChange={(val) => {
                setSortOption(val ?? "created_desc");
                setCurrentPage(1);
              }}
            >
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
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <div className="h-full min-h-80 flex items-center justify-center text-zinc-400 text-xs border border-white/10 bg-[#09090B] rounded-xs">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
            Loading work items...
          </div>
        ) : isError ? (
          <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center font-sans rounded-xs">
            Failed to load work items.
          </div>
        ) : (
          <WorkItemsTable
            issues={issues}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={20}
            onPageChange={setCurrentPage}
            onSelectIssue={handleSelectIssue}
          />
        )}
      </div>

      <CreateIssueModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        defaultType={selectedCreationType}
        statuses={statuses}
        sprints={boardSprints}
        parentCandidates={availableEpics.map((e: IssueItem) => ({
          id: e.id,
          key: e.key,
          title: e.title,
          issue_type: e.issue_type,
        }))}
      />
    </div>
  );
}
