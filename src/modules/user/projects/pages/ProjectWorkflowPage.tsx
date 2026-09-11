import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Loader2,
  MoreHorizontal,
  ChevronRight,
  GitCommit,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/useModal";
import { getSubdomain } from "@/utils/subdomain";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { useProjectWorkflow } from "../api/projectQueries";
import { CreateWorkflowStatusModal } from "../components/modals/CreateWorkflowStatusModal";
import { EditWorkflowStatusModal } from "../components/modals/EditWorkflowStatusModal";
import { DeleteWorkflowStatusModal } from "../components/modals/DeleteWorkflowStatusModal";
import type { WorkflowStatus } from "../types";

export function ProjectWorkflowPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const [searchQuery, setSearchQuery] = useState("");
  const createStatusModal = useModal();
  const editStatusModal = useModal();
  const deleteStatusModal = useModal();

  const [selectedStatus, setSelectedStatus] = useState<WorkflowStatus | null>(
    null,
  );

  const {
    data: workflowData,
    isLoading,
    isError,
  } = useProjectWorkflow(subdomain, projectSlug);

  const rawStatuses = workflowData?.statuses || [];

  const nextPosition = useMemo(() => {
    if (rawStatuses.length === 0) return 0;
    return Math.max(...rawStatuses.map((s) => s.position ?? 0)) + 1;
  }, [rawStatuses]);

  const displayedStatuses = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...rawStatuses].sort((a, b) => a.position - b.position);
    }

    const query = searchQuery.toLowerCase();
    return rawStatuses
      .filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query),
      )
      .sort((a, b) => a.position - b.position);
  }, [rawStatuses, searchQuery]);

  const previewStatuses = useMemo(() => {
    return [...rawStatuses].sort((a, b) => a.position - b.position);
  }, [rawStatuses]);

  const handleEditClick = (status: WorkflowStatus) => {
    setSelectedStatus(status);
    editStatusModal.openModal();
  };

  const handleDeleteClick = (status: WorkflowStatus) => {
    setSelectedStatus(status);
    deleteStatusModal.openModal();
  };

  return (
    <div className="bg-black text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-zinc-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Workflow
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Configure issue statuses and the order they move through.
            </p>
          </div>

          <Button
            onClick={createStatusModal.openModal}
            className="h-9 gap-2 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-none w-full sm:w-auto transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Status
          </Button>
        </div>

        <div className="border border-white/10 bg-[#09090B] p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search status..."
                className="pl-9 h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-none text-xs focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="min-h-52 flex items-center justify-center text-zinc-400 text-xs">
              <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
              Loading workflow statuses...
            </div>
          ) : isError ? (
            <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center font-sans">
              Failed to load project workflow configuration.
            </div>
          ) : displayedStatuses.length === 0 ? (
            <div className="min-h-52 flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-white/10">
              <p className="text-xs font-medium text-zinc-400">
                No statuses found.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
              {displayedStatuses.map((status: WorkflowStatus, idx: number) => {
                const statusColor = status.color || "#888888";

                return (
                  <div
                    key={status.id}
                    className="flex items-center gap-3 shrink-0"
                  >
                    <div className="w-56 bg-black border border-white/10 p-3.5 space-y-3 flex flex-col justify-between min-h-35 hover:border-white/20 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {status.icon &&
                              renderOrgIcon(status.icon, {
                                className: "h-3.5 w-3.5 shrink-0",
                                style: { color: statusColor },
                              })}
                            <span className="font-bold text-xs text-white">
                              {status.name}
                            </span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="text-zinc-500 hover:text-white p-0.5 transition-colors focus:outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#09090B] border-white/10 text-white font-mono min-w-28 rounded-none"
                            >
                              <DropdownMenuItem
                                onClick={() => handleEditClick(status)}
                                className="text-xs rounded-none cursor-pointer focus:bg-white/10 focus:text-white flex items-center gap-2"
                              >
                                <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(status)}
                                className="text-xs rounded-none cursor-pointer focus:bg-red-500/10 focus:text-red-400 text-red-400 flex items-center gap-2"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                          {status.category || "No description specified."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                        <span className="text-zinc-500">
                          {status.issue_count ?? 0} issues
                        </span>
                        {status.is_default && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 font-mono">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {idx < displayedStatuses.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#09090B] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Workflow Preview
            </h2>
            <span className="text-[10px] text-zinc-600 font-mono">
              Read-only
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {previewStatuses.map((status, idx) => (
              <div key={status.id} className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 border border-white/10 bg-black px-3 py-1.5">
                  {status.icon &&
                    renderOrgIcon(status.icon, {
                      className: "h-3.5 w-3.5 shrink-0",
                      style: { color: status.color || "#888888" },
                    })}
                  <span className="text-xs font-medium text-white">
                    {status.name}
                  </span>
                </div>
                {idx < previewStatuses.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <CreateWorkflowStatusModal
          isOpen={createStatusModal.isOpen}
          onClose={createStatusModal.closeModal}
          subdomain={subdomain}
          projectSlug={projectSlug}
          nextPosition={nextPosition}
        />

        <EditWorkflowStatusModal
          isOpen={editStatusModal.isOpen}
          onClose={() => {
            editStatusModal.closeModal();
            setSelectedStatus(null);
          }}
          subdomain={subdomain}
          projectSlug={projectSlug}
          status={selectedStatus}
        />

        <DeleteWorkflowStatusModal
          isOpen={deleteStatusModal.isOpen}
          onClose={() => {
            deleteStatusModal.closeModal();
            setSelectedStatus(null);
          }}
          subdomain={subdomain}
          projectSlug={projectSlug}
          status={selectedStatus}
        />
      </div>
    </div>
  );
}
