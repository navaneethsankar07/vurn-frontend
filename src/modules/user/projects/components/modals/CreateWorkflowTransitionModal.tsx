import { useState } from "react";
import { Loader2, ArrowRightLeft, Sparkles, AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateWorkflowTransition } from "../../api/projectMutations";
import type { WorkflowStatus } from "../../types";

interface CreateWorkflowTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  statuses: WorkflowStatus[];
}

export function CreateWorkflowTransitionModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  statuses,
}: CreateWorkflowTransitionModalProps) {
  const [name, setName] = useState("");
  const [fromStatusId, setFromStatusId] = useState<string>("");
  const [toStatusId, setToStatusId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createTransitionMutation = useCreateWorkflowTransition(
    subdomain,
    projectSlug,
  );

  const handleReset = () => {
    setName("");
    setFromStatusId("");
    setToStatusId("");
    setErrorMsg(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fromStatusId || !toStatusId) {
      setErrorMsg("Please select both source and destination statuses.");
      return;
    }

    if (fromStatusId === toStatusId) {
      setErrorMsg("Source and destination statuses must be distinct.");
      return;
    }

    createTransitionMutation.mutate(
      {
        from_status_id: Number(fromStatusId),
        to_status_id: Number(toStatusId),
        name: name.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          setErrorMsg(
            err?.response?.data?.error ||
              err?.response?.data?.message ||
              "Failed to create workflow transition.",
          );
        },
      },
    );
  };

  const selectedFromStatus = statuses.find(
    (s) => String(s.id) === fromStatusId,
  );
  const selectedToStatus = statuses.find((s) => String(s.id) === toStatusId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-0 overflow-hidden sm:max-w-lg">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-primary/10 border border-primary/20 text-primary">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                Create Transition Rule
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Define valid movement paths for issues moving between workflow
              statuses.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xs border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-sans flex items-start gap-2 animate-in fade-in-50">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  Transition Name
                </Label>
                <span className="text-[10px] text-zinc-500 font-sans">
                  Optional
                </span>
              </div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Start Progress, Send for Review"
                maxLength={60}
                className="h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  From Status <span className="text-primary">*</span>
                </Label>
                <Select
                  value={fromStatusId}
                  onValueChange={(val) => setFromStatusId(val ?? "")}
                >
                  <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-primary/50">
                    <SelectValue placeholder="Select origin status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#09090B] border-white/10 text-white font-mono rounded-none">
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.id}
                        value={String(status.id)}
                        className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-none font-sans"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: status.color || "#888888",
                            }}
                          />
                          <span>{status.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  To Status <span className="text-primary">*</span>
                </Label>
                <Select
                  value={toStatusId}
                  onValueChange={(val) => setToStatusId(val ?? "")}
                >
                  <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-primary/50">
                    <SelectValue placeholder="Select target status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#09090B] border-white/10 text-white font-mono rounded-none">
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.id}
                        value={String(status.id)}
                        className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-none font-sans"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: status.color || "#888888",
                            }}
                          />
                          <span>{status.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-white/10 bg-black/60 p-3 rounded-xs space-y-2">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Rule Preview
              </span>
              <div className="flex items-center justify-between gap-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {selectedFromStatus ? (
                    <>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            selectedFromStatus.color || "#888888",
                        }}
                      />
                      <span className="text-zinc-200 font-medium truncate">
                        {selectedFromStatus.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-zinc-600 italic">Select origin</span>
                  )}
                </div>

                <div className="flex flex-col items-center shrink-0 px-2">
                  <span className="text-[10px] text-primary font-mono font-medium truncate max-w-[100px]">
                    {name.trim() || "transition"}
                  </span>
                  <span className="text-zinc-500 text-[10px]">➔</span>
                </div>

                <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1">
                  {selectedToStatus ? (
                    <>
                      <span className="text-zinc-200 font-medium truncate text-right">
                        {selectedToStatus.name}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: selectedToStatus.color || "#888888",
                        }}
                      />
                    </>
                  ) : (
                    <span className="text-zinc-600 italic">Select target</span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5 bg-transparent">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-8 border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white text-xs rounded-xs font-sans transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTransitionMutation.isPending}
                className="h-8 bg-primary  text-black hover:bg-primary/90 text-xs font-semibold rounded-xs gap-2 transition-all shadow-sm"
              >
                {createTransitionMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Create Transition
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
