import { useState } from "react";
import { useParams } from "react-router-dom";
import { Layers, ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { CreateIssueModal } from "../components/modals/CreateIssueModal";
import { WORK_ITEM_TYPES } from "../constants";
import type { WorkItemType } from "../types";

export function ProjectIssuesPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const [selectedCreationType, setSelectedCreationType] =
    useState<WorkItemType>("task");

  const createModal = useModal();

  const { data: workflowData } = useProjectWorkflow(subdomain, projectSlug);
  const { data: boardSprints = [] } = useBoardSprints(subdomain, projectSlug);

  const statuses = workflowData?.statuses || [];

  const handleOpenCreateWithType = (type: WorkItemType) => {
    setSelectedCreationType(type);
    createModal.openModal();
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8 font-mono flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
              Work Items
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search, filter, and plan Epics, Stories, Tasks, and Bugs across this
            project.
          </p>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            onClick={() => handleOpenCreateWithType("task")}
            className="h-9 gap-1.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-l-xs rounded-r-none transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Work Item
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
              {WORK_ITEM_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => handleOpenCreateWithType(t.value)}
                    className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-xs font-sans flex items-center gap-2 py-2"
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: t.color }} />
                    <span>Create {t.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border border-dashed border-white/10 bg-[#09090B] p-12 text-center rounded-xs">
        <p className="text-zinc-500 text-xs">Work item register initialized.</p>
      </div>

      <CreateIssueModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        defaultType={selectedCreationType}
        statuses={statuses}
        sprints={boardSprints}
      />
    </div>
  );
}
