import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSprintCompletionCheck } from "../../api/sprintQueries";
import { useCompleteSprint } from "../../api/sprintMutations";

interface CompleteSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  sprintId: string | number;
  plannedSprints: { id: number; name: string }[];
}

export function CompleteSprintModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  sprintId,
  plannedSprints,
}: CompleteSprintModalProps) {
  const [actionType, setActionType] = useState<
    "sprint" | "new_sprint" | "backlog"
  >("backlog");
  const [targetSprintId, setTargetSprintId] = useState<string>("");

  const { data: checkData, isLoading: isChecking } = useSprintCompletionCheck(
    subdomain,
    projectSlug,
    sprintId,
    isOpen,
  );

  const { mutate: completeSprint, isPending: isCompleting } =
    useCompleteSprint();

  const handleComplete = () => {
    const payload: any = {};
    if (checkData?.requires_issue_action) {
      payload.incomplete_issue_action = actionType;
      if (actionType === "sprint") {
        payload.target_sprint_id = Number(targetSprintId);
      }
    }

    completeSprint(
      { subdomain, projectSlug, sprintId, payload },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-lg rounded-xs shadow-2xl p-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                Complete Sprint
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Review remaining items before finishing this sprint.
            </DialogDescription>
          </DialogHeader>

          {isChecking ? (
            <div className="py-12 flex items-center justify-center text-xs text-zinc-400 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span>Checking sprint status...</span>
            </div>
          ) : checkData?.requires_subtask_completion ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xs text-xs font-sans flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Sprint cannot be completed because there are incomplete
                  subtasks. You must finish them first.
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {checkData.incomplete_subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2 border border-white/5 bg-black rounded-xs text-xs flex items-center justify-between"
                  >
                    <span className="text-amber-500 font-semibold">
                      {sub.key}: {sub.title}
                    </span>
                    <span className="text-zinc-500">{sub.status_name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : checkData?.requires_issue_action ? (
            <div className="space-y-4 font-sans">
              <p className="text-xs text-zinc-300">
                Some work items are not completed. What would you like to do
                with them?
              </p>

              <div className="space-y-2.5 font-mono text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="incomplete_action"
                    checked={actionType === "backlog"}
                    onChange={() => setActionType("backlog")}
                    className="accent-amber-500"
                  />
                  <span>Move to Backlog</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="incomplete_action"
                    checked={actionType === "new_sprint"}
                    onChange={() => setActionType("new_sprint")}
                    className="accent-amber-500"
                  />
                  <span>Create a New Sprint</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="incomplete_action"
                    checked={actionType === "sprint"}
                    onChange={() => setActionType("sprint")}
                    className="accent-amber-500"
                  />
                  <span>Move to Another Sprint</span>
                </label>

                {actionType === "sprint" && (
                  <div className="pl-5 pt-1">
                    <Select
                      value={targetSprintId}
                      onValueChange={(val) => setTargetSprintId(val ?? "")}
                    >
                      <SelectTrigger className="h-8 border-white/10 bg-black text-xs text-white rounded-xs">
                        <SelectValue placeholder="Select target sprint" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#09090B] border-white/10 text-white font-mono text-xs rounded-xs">
                        {plannedSprints.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-300 font-sans">
              All issues and subtasks are completed! Ready to finish this
              sprint?
            </p>
          )}

          <DialogFooter className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs"
            >
              Cancel
            </Button>
            {!checkData?.requires_subtask_completion && (
              <Button
                type="button"
                disabled={
                  isCompleting || (actionType === "sprint" && !targetSprintId)
                }
                onClick={handleComplete}
                className="h-8 bg-emerald-500 text-black hover:bg-emerald-400 font-semibold text-xs rounded-xs gap-1.5"
              >
                {isCompleting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Confirm Complete
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
