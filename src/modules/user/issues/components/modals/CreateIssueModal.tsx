import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateProjectIssue } from "../../api/issueMutations";
import {
  createIssueSchema,
  type CreateIssueFormValues,
} from "../../schemas/createIssueSchema";
import { WORK_ITEM_TYPES, WORK_ITEM_PRIORITIES } from "../../constants";
import type { WorkItemType } from "../../types";
import type { WorkflowStatus } from "@/modules/user/projects/types";
import type { BoardSprintOption } from "@/modules/user/sprints/types";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  defaultType?: WorkItemType;
  statuses?: WorkflowStatus[];
  sprints?: BoardSprintOption[];
  parentCandidates?: {
    id: number;
    key: string;
    title: string;
    issue_type: string;
  }[];
}

export function CreateIssueModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  defaultType = "task",
  statuses = [],
  sprints = [],
  parentCandidates = [],
}: CreateIssueModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      issue_type: defaultType,
      title: "",
      description: "",
      parent_id: "",
      sprint_id: "",
      status_id: statuses[0]?.id ? String(statuses[0].id) : "",
      assignee_id: "",
      priority: "medium",
      story_points: "",
    },
  });

  const selectedType = watch("issue_type");
  const selectedPriority = watch("priority");
  const selectedStatusId = watch("status_id");
  const selectedSprintId = watch("sprint_id");
  const selectedParentId = watch("parent_id");

  useEffect(() => {
    if (isOpen) {
      setValue("issue_type", defaultType);
      if (statuses.length > 0 && !selectedStatusId) {
        setValue("status_id", String(statuses[0].id));
      }
    }
  }, [isOpen, defaultType, statuses, setValue, selectedStatusId]);

  const { mutate: createIssue, isPending } = useCreateProjectIssue();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateIssueFormValues) => {
    const payload = {
      issue_type: values.issue_type,
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      priority: values.priority,
      status_id: values.status_id ? Number(values.status_id) : undefined,
      sprint_id:
        values.issue_type !== "epic" && values.sprint_id
          ? Number(values.sprint_id)
          : undefined,
      parent_id:
        values.issue_type !== "epic" && values.parent_id
          ? Number(values.parent_id)
          : undefined,
      story_points:
        values.issue_type !== "epic" && values.story_points
          ? Number(values.story_points)
          : undefined,
    };

    createIssue(
      { subdomain, projectSlug, data: payload },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          const apiError =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to create work item.";
          setError("root", { message: apiError });
        },
      },
    );
  };

  const activeTypeConfig =
    WORK_ITEM_TYPES.find((t) => t.value === selectedType) ?? WORK_ITEM_TYPES[2];
  const activePriorityConfig =
    WORK_ITEM_PRIORITIES.find((p) => p.value === selectedPriority) ??
    WORK_ITEM_PRIORITIES[2];
  const activeStatus = statuses.find((s) => String(s.id) === selectedStatusId);
  const activeSprint = sprints.find((s) => String(s.id) === selectedSprintId);
  const activeParent = parentCandidates.find(
    (p) => String(p.id) === selectedParentId,
  );

  const isEpic = selectedType === "epic";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-xl rounded-xs shadow-2xl p-0 overflow-hidden sm:max-w-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div
                className="p-1.5 rounded-xs border"
                style={{
                  backgroundColor: `${activeTypeConfig.color}15`,
                  borderColor: `${activeTypeConfig.color}30`,
                }}
              >
                <activeTypeConfig.icon
                  className="h-4 w-4"
                  style={{ color: activeTypeConfig.color }}
                />
              </div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                Create {activeTypeConfig.label}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              {activeTypeConfig.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="p-3 rounded-xs border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-sans flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  Work Item Type
                </Label>
                <Controller
                  control={control}
                  name="issue_type"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as WorkItemType)
                      }
                    >
                      <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <activeTypeConfig.icon
                              className="h-3.5 w-3.5"
                              style={{ color: activeTypeConfig.color }}
                            />
                            <span className="text-zinc-200">
                              {activeTypeConfig.label}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                      >
                        {WORK_ITEM_TYPES.filter((t) => t.value !== "subtask").map((t) => {
                          const Icon = t.icon;
                          return (
                            <SelectItem
                              key={t.value}
                              value={t.value}
                              className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                            >
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="h-3.5 w-3.5 "
                                  style={{ color: t.color }}
                                />
                                <span>{t.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  Priority
                </Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: activePriorityConfig.color,
                              }}
                            />
                            <span className="text-zinc-200">
                              {activePriorityConfig.label}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                      >
                        {WORK_ITEM_PRIORITIES.map((p) => (
                          <SelectItem
                            key={p.value}
                            value={p.value}
                            className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: p.color }}
                              />
                              <span>{p.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide flex items-center justify-between">
                <span>
                  Title <span className="text-amber-500">*</span>
                </span>
              </Label>
              <Input
                {...register("title")}
                placeholder="What needs to be done?"
                className="h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans"
              />
              {errors.title && (
                <p className="text-[11px] text-red-400 font-sans">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                {...register("description")}
                rows={3}
                placeholder="Add more context, acceptance criteria, or technical scope..."
                className="border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  Workflow Status
                </Label>
                <Controller
                  control={control}
                  name="status_id"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val ?? "")}
                    >
                      <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                        <SelectValue placeholder="Select Status">
                          {activeStatus ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    activeStatus.color || "#888888",
                                }}
                              />
                              <span className="truncate text-zinc-200">
                                {activeStatus.name}
                              </span>
                            </div>
                          ) : (
                            "Select Status"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                      >
                        {statuses.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={String(s.id)}
                            className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: s.color || "#888888",
                                }}
                              />
                              <span>{s.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {!isEpic && (
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                    Sprint
                  </Label>
                  <Controller
                    control={control}
                    name="sprint_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
                        <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                          <SelectValue placeholder="Select Sprint">
                            <span className="text-zinc-200">
                              {activeSprint
                                ? activeSprint.name
                                : "None (Scope / Backlog)"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          alignItemWithTrigger={false}
                          className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                        >
                          <SelectItem
                            value=""
                            className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                          >
                            None (Scope / Backlog)
                          </SelectItem>
                          {sprints.map((s) => (
                            <SelectItem
                              key={s.id}
                              value={String(s.id)}
                              className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                            >
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>

            {!isEpic && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                    Parent Initiative
                  </Label>
                  <Controller
                    control={control}
                    name="parent_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
                        <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                          <SelectValue placeholder="Select Parent Item">
                            <span className="text-zinc-200">
                              {activeParent
                                ? `${activeParent.key}: ${activeParent.title}`
                                : "None"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          alignItemWithTrigger={false}
                          className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                        >
                          <SelectItem
                            value=""
                            className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                          >
                            None
                          </SelectItem>
                          {parentCandidates.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={String(p.id)}
                              className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 not-data-[variant=destructive]:focus:**:text-zinc-100 rounded-xs font-sans"
                            >
                              <span className="font-semibold text-amber-500 mr-2">
                                {p.key}
                              </span>
                              <span className="truncate">{p.title}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                    Story Points
                  </Label>
                  <Input
                    {...register("story_points")}
                    type="number"
                    min="0"
                    placeholder="e.g. 1, 2, 3, 5, 8"
                    className="h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans"
                  />
                  {errors.story_points && (
                    <p className="text-[11px] text-red-400 font-sans">
                      {errors.story_points.message}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                disabled={isPending}
                className="h-8 bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold rounded-xs gap-2 transition-all shadow-sm"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Create {activeTypeConfig.label}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
