import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { useUpdateWorkflowTransition } from "../../api/projectMutations";
import type { WorkflowStatus, WorkflowTransition } from "../../types";
import {
  updateWorkflowTransitionSchema,
  type UpdateWorkflowTransitionFormValues,
} from "../../schemas/updateWorkflowTransitionSchema";

interface EditWorkflowTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  statuses: WorkflowStatus[];
  transition: WorkflowTransition | null;
}

export function EditWorkflowTransitionModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  statuses,
  transition,
}: EditWorkflowTransitionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<UpdateWorkflowTransitionFormValues>({
    resolver: zodResolver(updateWorkflowTransitionSchema),
    defaultValues: {
      name: "",
      from_status_id: "",
      to_status_id: "",
    },
  });

  const updateMutation = useUpdateWorkflowTransition(
    subdomain,
    projectSlug,
    transition?.id ?? "",
  );

  useEffect(() => {
    if (transition && isOpen) {
      reset({
        name: transition.name || "",
        from_status_id: String(transition.from_status_id),
        to_status_id: String(transition.to_status_id),
      });
    }
  }, [transition, isOpen, reset]);

  const watchedName = watch("name");
  const watchedFromId = watch("from_status_id");
  const watchedToId = watch("to_status_id");

  const selectedFromStatus = statuses.find(
    (s) => String(s.id) === watchedFromId,
  );
  const selectedToStatus = statuses.find((s) => String(s.id) === watchedToId);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: UpdateWorkflowTransitionFormValues) => {
    if (!transition) return;

    updateMutation.mutate(
      {
        from_status_id: Number(data.from_status_id),
        to_status_id: Number(data.to_status_id),
        name: data.name?.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          const apiError =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            "Failed to update workflow transition.";
          setError("root", { message: apiError });
        },
      },
    );
  };

  if (!transition) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-md rounded-xs shadow-2xl p-0 overflow-hidden sm:max-w-lg">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                Edit Transition Rule
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Update endpoints or the display name for this movement rule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="p-3 rounded-xs border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-sans flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errors.root.message}</span>
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
                {...register("name")}
                placeholder="e.g. Start Development, Send for Review"
                maxLength={60}
                className="h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 font-sans"
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 font-sans">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  From Status <span className="text-amber-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="from_status_id"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val ?? "")}
                    >
                      <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500">
                        <SelectValue placeholder="Select origin status">
                          {selectedFromStatus && (
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    selectedFromStatus.color || "#888888",
                                }}
                              />
                              <span className="truncate">
                                {selectedFromStatus.name}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                      >
                        {statuses.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={String(status.id)}
                            className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-xs font-sans"
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
                  )}
                />
                {errors.from_status_id && (
                  <p className="text-[11px] text-red-400 font-sans">
                    {errors.from_status_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  To Status <span className="text-amber-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="to_status_id"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val ?? "")}
                    >
                      <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500">
                        <SelectValue placeholder="Select target status">
                          {selectedToStatus && (
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    selectedToStatus.color || "#888888",
                                }}
                              />
                              <span className="truncate">
                                {selectedToStatus.name}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                      >
                        {statuses.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={String(status.id)}
                            className="text-xs cursor-pointer focus:bg-white/10 focus:text-white rounded-xs font-sans"
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
                  )}
                />
                {errors.to_status_id && (
                  <p className="text-[11px] text-red-400 font-sans">
                    {errors.to_status_id.message}
                  </p>
                )}
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
                  <span className="text-[10px] text-amber-500 font-mono font-medium truncate max-w-25">
                    {watchedName?.trim() || "transition"}
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
                disabled={updateMutation.isPending}
                className="h-8 bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold rounded-xs gap-2 transition-all shadow-sm"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
