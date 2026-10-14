import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCreateProjectIssue } from "../../api/issueMutations";
import {
  createIssueSchema,
  type CreateIssueFormValues,
} from "../../schemas/createIssueSchema";
import { WORK_ITEM_TYPES } from "../../constants";
import type { WorkItemType } from "../../types";
import type { WorkflowStatus } from "@/modules/user/projects/types";
import type { BoardSprintOption } from "@/modules/user/sprints/types";
import { CreateIssueFormFields } from "./components/CreateIssueFormFields";
import { IssueAiDuplicatesSection } from "@/modules/user/ai/components/IssueAiDuplicatesSection";

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
  defaultSprintId?: string;
  defaultParentId?: string;
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
  defaultSprintId,
  defaultParentId,
}: CreateIssueModalProps) {
  const defaultStatus = statuses.find((s) => s.is_default) || statuses[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      issue_type: defaultType,
      title: "",
      description: "",
      parent_id: defaultParentId || "",
      sprint_id: defaultSprintId || "",
      status_id: defaultStatus?.id ? String(defaultStatus.id) : "",
      assignee_id: "",
      priority: "medium",
      story_points: "",
      due_date: "",
      estimated_time: "",
    },
  });

  const selectedType = watch("issue_type");
  const selectedPriority = watch("priority");
  const selectedStatusId = watch("status_id");
  const selectedSprintId = watch("sprint_id");
  const selectedParentId = watch("parent_id");
  const currentTitle = watch("title");
  const currentDescription = watch("description");

  useEffect(() => {
    if (isOpen) {
      reset({
        issue_type: defaultType,
        title: "",
        description: "",
        parent_id: defaultParentId || "",
        sprint_id: defaultSprintId || "",
        status_id: defaultStatus?.id ? String(defaultStatus.id) : "",
        assignee_id: "",
        priority: "medium",
        story_points: "",
        due_date: "",
        estimated_time: "",
      });
    }
  }, [
    isOpen,
    defaultType,
    defaultStatus,
    defaultSprintId,
    defaultParentId,
    reset,
  ]);

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
      due_date: values.due_date || undefined,
      estimated_time:
        values.estimated_time && !isNaN(Number(values.estimated_time))
          ? Number(values.estimated_time)
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
  const isEpic = selectedType === "epic";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono max-w-xl rounded-xs shadow-2xl p-0 overflow-hidden sm:max-w-2xl">
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
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

            <CreateIssueFormFields
              control={control}
              register={register}
              errors={errors}
              statuses={statuses}
              sprints={sprints}
              parentCandidates={parentCandidates}
              isEpic={isEpic}
              selectedType={selectedType}
              selectedPriority={selectedPriority}
              selectedStatusId={selectedStatusId || ""}
              selectedSprintId={selectedSprintId || ""}
              selectedParentId={selectedParentId || ""}
            />

            <IssueAiDuplicatesSection
              projectSlug={projectSlug}
              title={currentTitle}
              description={currentDescription}
              issueType={selectedType}
              priority={selectedPriority}
            />

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
                className="h-8 bg-transparent text-primary hover:bg-transparent border border-primary hover:border-primary/70 hover:text-primary/70 text-xs font-semibold rounded-xs gap-2 transition-all shadow-sm"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  ""
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
