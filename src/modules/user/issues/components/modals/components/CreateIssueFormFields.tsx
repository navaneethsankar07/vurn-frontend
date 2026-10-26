import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
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

import { WORK_ITEM_TYPES, WORK_ITEM_PRIORITIES } from "../../../constants";
import type { CreateIssueFormValues } from "../../../schemas/createIssueSchema";
import type { WorkflowStatus } from "@/modules/user/projects/types";
import type { BoardSprintOption } from "@/modules/user/sprints/types";
import { DatePickerPopover } from "./DatePickerPopover";

interface CreateIssueFormFieldsProps {
  control: Control<CreateIssueFormValues>;
  register: UseFormRegister<CreateIssueFormValues>;
  errors: FieldErrors<CreateIssueFormValues>;
  statuses: WorkflowStatus[];
  sprints: BoardSprintOption[];
  parentCandidates: {
    id: number;
    key: string;
    title: string;
    issue_type: string;
  }[];
  isEpic: boolean;
  selectedType: string;
  selectedPriority: string;
  selectedStatusId: string | undefined;
  selectedSprintId: string | undefined;
  selectedParentId: string | undefined;
}

export function CreateIssueFormFields({
  control,
  register,
  errors,
  statuses,
  sprints,
  parentCandidates,
  isEpic,
  selectedType,
  selectedPriority,
  selectedStatusId,
  selectedSprintId,
  selectedParentId,
}: CreateIssueFormFieldsProps) {
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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Work Item Type
          </Label>
          <Controller
            control={control}
            name="issue_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
                  className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                >
                  {WORK_ITEM_TYPES.filter((t) => t.value !== "subtask").map(
                    (t) => {
                      const Icon = t.icon;
                      return (
                        <SelectItem
                          key={t.value}
                          value={t.value}
                          className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="h-3.5 w-3.5"
                              style={{ color: t.color }}
                            />
                            <span>{t.label}</span>
                          </div>
                        </SelectItem>
                      );
                    },
                  )}
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
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 border-white/10 bg-black text-white rounded-xs text-xs focus:ring-1 focus:ring-amber-500">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activePriorityConfig.color }}
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
                  className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                >
                  {WORK_ITEM_PRIORITIES.map((p) => (
                    <SelectItem
                      key={p.value}
                      value={p.value}
                      className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
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
        <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
          Title <span className="text-amber-500">*</span>
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
                            backgroundColor: activeStatus.color || "#888888",
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
                  className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                >
                  {statuses.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={String(s.id)}
                      className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.color || "#888888" }}
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
                    className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                  >
                    <SelectItem
                      value=""
                      className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
                    >
                      None (Scope / Backlog)
                    </SelectItem>
                    {sprints.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={String(s.id)}
                        className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Due Date
          </Label>
          <Controller
            control={control}
            name="due_date"
            render={({ field }) => (
              <DatePickerPopover
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                placeholder="Select due date"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Estimated Time (Hours)
          </Label>
          <Input
            {...register("estimated_time")}
            type="number"
            min="1"
            placeholder="e.g. 4"
            className="h-9 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-amber-500 font-sans"
          />
          {errors.estimated_time && (
            <p className="text-[11px] text-red-400 font-sans">
              {errors.estimated_time.message}
            </p>
          )}
        </div>
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
                    className="bg-[#09090B] border-white/10 text-white font-mono rounded-xs"
                  >
                    <SelectItem
                      value=""
                      className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
                    >
                      None
                    </SelectItem>
                    {parentCandidates.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={String(p.id)}
                        className="text-xs cursor-pointer text-zinc-200 focus:bg-white/10 focus:text-zinc-100 rounded-xs font-sans"
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
    </div>
  );
}
