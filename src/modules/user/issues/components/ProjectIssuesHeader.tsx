import { Layers, Zap, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { WorkItemType, IssueItem } from "../types";
import type { BoardSprintOption } from "@/modules/user/sprints/types";

interface ProjectIssuesHeaderProps {
  activeTab: "issues" | "epics";
  onTabChange: (tab: "issues" | "epics") => void;
  availableEpics: IssueItem[];
  sprintFilter: string;
  onSprintFilterChange: (val: string | null) => void;
  selectedSprintLabel: string;
  boardSprints: BoardSprintOption[];
  selectedEpicFilter: string;
  onEpicFilterChange: (val: string | null) => void;
  selectedEpicLabel: string;
  onOpenCreateWithType: (type: WorkItemType) => void;
}

export function ProjectIssuesHeader({
  activeTab,
  onTabChange,
  availableEpics,
  sprintFilter,
  onSprintFilterChange,
  selectedSprintLabel,
  boardSprints,
  selectedEpicFilter,
  onEpicFilterChange,
  selectedEpicLabel,
  onOpenCreateWithType,
}: ProjectIssuesHeaderProps) {
  return (
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
              onClick={() => onTabChange("issues")}
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
              onClick={() => onTabChange("epics")}
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
                  onValueChange={onSprintFilterChange}
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
                  onValueChange={onEpicFilterChange}
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
            onOpenCreateWithType(activeTab === "epics" ? "epic" : "task")
          }
          className="h-9 gap-1.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-l-xs rounded-r-none transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {activeTab === "epics" ? "Create Epic" : "Create Work Item"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="h-9 px-2 bg-amber-500 hover:bg-amber-400 text-black border-l border-black/20 rounded-r-xs rounded-l-none inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={4}
            className="bg-[#09090B] border-white/10 text-white font-mono min-w-44 rounded-xs"
          >
            {WORK_ITEM_TYPES.filter((t) => t.value !== "subtask").map((t) => {
              const Icon = t.icon;
              return (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => onOpenCreateWithType(t.value)}
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
  );
}
