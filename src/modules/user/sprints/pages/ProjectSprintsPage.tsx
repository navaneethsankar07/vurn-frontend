import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus, Loader2, Layers } from "lucide-react";

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
import type { Sprint } from "../types";


export function ProjectSprintsPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const createSprintModal = useModal();

  const {
    data: sprints = [],
    isLoading,
    isError,
  } = useProjectSprints(subdomain, projectSlug);

  return (
    <div className="bg-black text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
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
            className="h-9 gap-2 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-none transition-all shadow-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <div className="border border-white/10 bg-[#09090B] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sprints..."
              className="pl-9 h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-none text-xs focus-visible:ring-1 focus-visible:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-none">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent className="bg-[#09090B] border-white/10 text-white font-mono rounded-none text-xs">
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value ?? "newest")}
            >
              <SelectTrigger className="w-36 h-9 border-white/10 bg-black text-xs text-zinc-300 rounded-none">
                <SelectValue placeholder="Sort: Newest" />
              </SelectTrigger>
              <SelectContent className="bg-[#09090B] border-white/10 text-white font-mono rounded-none text-xs">
                <SelectItem value="newest">Sort: Newest</SelectItem>
                <SelectItem value="oldest">Sort: Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
              No sprints found for this project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
