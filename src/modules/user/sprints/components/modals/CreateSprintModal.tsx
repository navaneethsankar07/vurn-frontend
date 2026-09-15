import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, startOfToday, isBefore } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  X,
  Loader2,
  Bold,
  Italic,
  Code,
  List,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  Eye,
  Edit3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  createSprintSchema,
  type CreateSprintInput,
} from "../../schemas/sprintSchema";
import { useCreateProjectSprint } from "../../api/sprintMutations";

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
}

export function CreateSprintModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
}: CreateSprintModalProps) {
  const [goalTab, setGoalTab] = useState<"edit" | "preview">("edit");
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit");

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateSprintInput>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      name: "",
      goal: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  const { ref: descriptionFormRef, ...descriptionRegister } =
    register("description");

  const startDateWatch = watch("start_date");
  const goalValue = watch("goal") || "";
  const descValue = watch("description") || "";

  const { mutate: createSprint, isPending } = useCreateProjectSprint(
    subdomain,
    projectSlug,
    {
      onSuccess: () => {
        reset();
        onClose();
      },
    },
  );

  if (!isOpen) return null;

  const handleMarkdownAction = (prefix: string, suffix: string = "") => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const selectedText = currentText.substring(start, end);
    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}${suffix}`;

    const newText =
      currentText.substring(0, start) +
      replacement +
      currentText.substring(end);

    setValue("description", newText, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        const cursorPosition = start + prefix.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const onSubmit = (data: CreateSprintInput) => {
    createSprint(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-mono">
      <div className="w-full max-w-2xl bg-[#09090B] border border-white/10 rounded-xs shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090B]">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Create Sprint
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Plan and organize work for the upcoming sprint.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors focus:outline-hidden p-1.5 rounded-xs hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>
                Sprint Name <span className="text-amber-500">*</span>
              </span>
            </label>
            <Input
              {...register("name")}
              placeholder="e.g. Sprint 12"
              className="h-9 border-white/10 bg-black text-white text-xs rounded-xs focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 placeholder:text-zinc-600 transition-colors"
            />
            {errors.name && (
              <p className="text-[11px] text-red-400 font-sans">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                <span>Start Date</span>
                <span className="text-amber-500">*</span>
              </label>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 border-white/10 bg-black text-white text-xs justify-start rounded-xs font-mono hover:bg-zinc-900 hover:text-white hover:border-white/20 transition-colors"
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {field.value
                            ? format(parseISO(field.value), "PPP")
                            : "Select start date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-[#09090B] border-white/10 rounded-xs shadow-xl"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? parseISO(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        disabled={(date) => isBefore(date, startOfToday())}
                        className="bg-[#09090B] text-white rounded-xs p-3 [&_.rdp-day_selected]:bg-amber-500 [&_.rdp-day_selected]:text-black! [&_.rdp-day_selected]:font-bold [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day]:hover:text-white [&_.rdp-day]:rounded-xs"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.start_date && (
                <p className="text-[11px] text-red-400 font-sans">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                <span>End Date</span>
                <span className="text-amber-500">*</span>
              </label>
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 border-white/10 bg-black text-white text-xs justify-start rounded-xs font-mono hover:bg-zinc-900 hover:text-white hover:border-white/20 transition-colors"
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {field.value
                            ? format(parseISO(field.value), "PPP")
                            : "Select end date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-[#09090B] border-white/10 rounded-xs shadow-xl"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? parseISO(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        disabled={(date) => {
                          const minDate = startDateWatch
                            ? parseISO(startDateWatch)
                            : startOfToday();
                          return isBefore(date, minDate);
                        }}
                        className="bg-[#09090B] text-white rounded-xs p-3 [&_.rdp-day_selected]:bg-amber-500 [&_.rdp-day_selected]:text-black! [&_.rdp-day_selected]:font-bold [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day]:hover:text-white [&_.rdp-day]:rounded-xs"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.end_date && (
                <p className="text-[11px] text-red-400 font-sans">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Sprint Goal
              </label>
              <div className="flex items-center gap-1 bg-black p-0.5 border border-white/10 rounded-xs">
                <button
                  type="button"
                  onClick={() => setGoalTab("edit")}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs transition-colors ${
                    goalTab === "edit"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setGoalTab("preview")}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs transition-colors ${
                    goalTab === "preview"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </div>
            </div>

            {goalTab === "edit" ? (
              <Textarea
                {...register("goal")}
                placeholder="Describe the objective of this sprint..."
                className="h-20 border-white/10 bg-black text-white text-xs rounded-xs focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 resize-none font-sans placeholder:text-zinc-600 transition-colors"
              />
            ) : (
              <div className="h-20 p-2.5 border border-white/10 bg-black text-xs text-zinc-300 rounded-xs prose prose-invert max-w-none font-sans overflow-y-auto">
                {goalValue ? (
                  <ReactMarkdown>{goalValue}</ReactMarkdown>
                ) : (
                  <span className="text-zinc-600 italic">
                    Nothing to preview
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Sprint Description{" "}
                <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-1 bg-black p-0.5 border border-white/10 rounded-xs">
                <button
                  type="button"
                  onClick={() => setDescTab("edit")}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs transition-colors ${
                    descTab === "edit"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab("preview")}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs transition-colors ${
                    descTab === "preview"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </div>
            </div>

            {descTab === "edit" ? (
              <div className="border border-white/10 bg-black rounded-xs overflow-hidden focus-within:border-amber-500 transition-colors">
                <div className="flex items-center gap-1 border-b border-white/10 p-1 bg-[#09090B]">
                  <button
                    type="button"
                    onClick={() => handleMarkdownAction("**", "**")}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkdownAction("*", "*")}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkdownAction("`", "`")}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkdownAction("- ")}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkdownAction("[", "](url)")}
                    className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Textarea
                  {...descriptionRegister}
                  ref={(e) => {
                    descriptionFormRef(e);
                    descriptionRef.current = e;
                  }}
                  placeholder="Add context, links, and acceptance criteria..."
                  className="h-32 border-none bg-transparent text-white text-xs rounded-none focus-visible:ring-0 resize-none font-sans p-3 placeholder:text-zinc-600"
                />
              </div>
            ) : (
              <div className="h-40.5 p-3 border border-white/10 bg-black text-xs text-zinc-300 rounded-xs prose prose-invert max-w-none font-sans overflow-y-auto">
                {descValue ? (
                  <ReactMarkdown>{descValue}</ReactMarkdown>
                ) : (
                  <span className="text-zinc-600 italic">
                    Nothing to preview
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-8 px-4 border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10 text-xs rounded-xs transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-8 px-4 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs transition-colors"
            >
              {isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Create Sprint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
