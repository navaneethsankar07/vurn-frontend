import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Loader2,
  Layers,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
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

import { useModal } from "@/hooks/useModal";
import { getSubdomain } from "@/utils/subdomain";
import { useProjectSprints } from "../api/sprintQueries";
import { SprintCard } from "../components/SprintCard";
import { CreateSprintModal } from "../components/modals/CreateSprintModal";
import type { Sprint, SprintStatus, SprintSortOption } from "../types";

export function ProjectSprintsPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [sortField, setSortField] = useState<string>("start_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const createSprintModal = useModal();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const sortOrder: SprintSortOption =
    `${sortField}_${sortDirection}` as SprintSortOption;

  const queryParams = {
    search: activeSearch || undefined,
    status: statusFilter !== "all" ? (statusFilter as SprintStatus) : undefined,
    sort: sortOrder,
    page,
  };

  const {
    data: sprintData,
    isLoading,
    isError,
  } = useProjectSprints(subdomain, projectSlug, queryParams);

  const sprints = sprintData?.results || [];
  const totalCount = sprintData?.count || 0;
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const sortLabels: Record<string, string> = {
    start_date: "Start Date",
    end_date: "End Date",
    created: "Created",
    name: "Name",
  };

  const statusLabels: Record<string, string> = {
    all: "Status: All",
    active: "Active",
    planned: "Planned",
    completed: "Completed",
  };

  return (
    <div className="bg-black text-white font-mono h-full flex flex-col overflow-hidden">
      <div className="shrink-0 bg-black pt-1 pb-4 space-y-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-zinc-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Sprints
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Manage every sprint inside this project.
            </p>
          </div>

          <Button
            type="button"
            onClick={createSprintModal.openModal}
            className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-none transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <div className="border border-white/10 bg-[#09090B] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search sprints and press Enter..."
              className="pl-9 pr-9 h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-none text-xs focus-visible:ring-1 focus-visible:ring-amber-500/50"
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
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value ?? "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-none cursor-pointer">
                <SelectValue>
                  {statusLabels[statusFilter] ?? "Status: All"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="bg-[#09090B] border-white/10 text-white font-mono rounded-none text-xs"
              >
                <SelectItem
                  value="all"
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                >
                  Status: All
                </SelectItem>
                <SelectItem
                  value="active"
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="planned"
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                >
                  Planned
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                >
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Select
                value={sortField}
                onValueChange={(value) => {
                  setSortField(value ?? "start_date");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-none cursor-pointer">
                  <SelectValue>
                    {sortLabels[sortField] ?? "Start Date"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="bg-[#09090B] border-white/10 text-white font-mono rounded-none text-xs"
                >
                  <SelectItem
                    value="start_date"
                    className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                  >
                    Start Date
                  </SelectItem>
                  <SelectItem
                    value="end_date"
                    className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                  >
                    End Date
                  </SelectItem>
                  <SelectItem
                    value="created"
                    className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                  >
                    Created
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-white rounded-none"
                  >
                    Name
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                onClick={toggleSortDirection}
                className="h-9 w-9 p-0 border-white/10 bg-black text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none shrink-0 cursor-pointer"
              >
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-4 w-4 text-amber-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-amber-500" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4">
        {isLoading ? (
          <div className="min-h-64 flex items-center justify-center text-zinc-400 text-xs border border-white/10 bg-[#09090B]">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
            Loading sprints...
          </div>
        ) : isError ? (
          <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center font-sans">
            Failed to load project sprints.
          </div>
        ) : sprints.length === 0 ? (
          <div className="min-h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-white/10 bg-[#09090B]">
            <p className="text-xs font-medium text-zinc-400">
              No sprints found matching criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {sprints.map((sprint: Sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onOpenSprint={(sprint) => {
                    navigate(`/projects/${projectSlug}/sprints/${sprint.id}`);
                  }}
                  onEditSprint={(s) => console.log("Edit sprint:", s)}
                  onDeleteSprint={(s) => console.log("Delete sprint:", s)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-zinc-400">
                <span>
                  Showing page <strong className="text-white">{page}</strong> of{" "}
                  <strong className="text-white">{totalPages}</strong> (
                  {totalCount} total)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 border-white/10 bg-black text-zinc-300 hover:text-white rounded-none disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 px-3 border-white/10 bg-black text-zinc-300 hover:text-white rounded-none disabled:opacity-40 cursor-pointer"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <CreateSprintModal
          isOpen={createSprintModal.isOpen}
          onClose={createSprintModal.closeModal}
          subdomain={subdomain}
          projectSlug={projectSlug}
        />
      </div>
    </div>
  );
}
