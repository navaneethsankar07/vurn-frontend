import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useModal } from "@/hooks/useModal";
import { getSubdomain } from "@/utils/subdomain";
import { useProjectWorkflow } from "../../projects/api/projectQueries";
import { useBoardSprints } from "../../sprints/api/sprintQueries";
import { useProjectIssues } from "../api/issueQueries";
import { CreateIssueModal } from "../components/modals/CreateIssueModal";
import { WorkItemsTable } from "../components/WorkItemsTable";
import { ProjectIssuesHeader } from "../components/ProjectIssuesHeader";
import { ProjectIssuesToolbar } from "../components/ProjectIssuesToolbar";
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
        <ProjectIssuesHeader
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "epics") setTypeFilter("all");
            setCurrentPage(1);
          }}
          availableEpics={availableEpics}
          sprintFilter={sprintFilter}
          onSprintFilterChange={(val) => {
            setSprintFilter(val ?? "all");
            setCurrentPage(1);
          }}
          selectedSprintLabel={selectedSprintLabel}
          boardSprints={boardSprints}
          selectedEpicFilter={selectedEpicFilter}
          onEpicFilterChange={(val) => {
            setSelectedEpicFilter(val ?? "all");
            setCurrentPage(1);
          }}
          selectedEpicLabel={selectedEpicLabel}
          onOpenCreateWithType={(type) => handleOpenCreateWithType(type)}
        />

        <ProjectIssuesToolbar
          activeTab={activeTab}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearchSubmit={handleKeyDown}
          onClearSearch={handleClearSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={(val) => {
            setTypeFilter(val ?? "all");
            setCurrentPage(1);
          }}
          selectedTypeLabel={selectedTypeLabel}
          nonEpicTypes={nonEpicTypes}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={(val) => {
            setPriorityFilter(val ?? "all");
            setCurrentPage(1);
          }}
          selectedPriorityLabel={selectedPriorityLabel}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val ?? "all");
            setCurrentPage(1);
          }}
          selectedStatusLabel={selectedStatusLabel}
          statuses={statuses}
          sortOption={sortOption}
          onSortOptionChange={(val) => {
            setSortOption(val ?? "created_desc");
            setCurrentPage(1);
          }}
          selectedSortLabel={selectedSortLabel}
        />
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
