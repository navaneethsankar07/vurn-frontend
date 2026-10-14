import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  releaseNotesSchema,
  type ReleaseNotesFormValues,
} from "../schemas/releaseNotesSchema";
import type { GitHubRepository } from "../../integrations/github/types";
import { ReleaseNotesRepoSelect } from "./ReleaseNotesRepoSelect";

interface ReleaseNotesFormProps {
  repositories: GitHubRepository[];
  defaultRepositoryId?: number;
  isPending: boolean;
  onSubmit: (values: ReleaseNotesFormValues) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ReleaseNotesDatePicker({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="h-9 w-full px-3 flex items-center justify-between border border-white/10 bg-black text-white rounded-xs text-xs font-mono focus:ring-1 focus:ring-primary hover:border-white/20 transition-colors cursor-pointer"
      >
        <span className={value ? "text-zinc-200" : "text-zinc-600"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1.5">
          {value && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-zinc-500 hover:text-white p-0.5"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 p-3 bg-[#09090B] border border-white/10 text-white rounded-xs font-mono shadow-2xl space-y-3 z-50"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-semibold text-zinc-200">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 font-semibold">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = value === formatted;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={`h-7 w-7 rounded-xs flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary text-black font-semibold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ReleaseNotesForm({
  repositories,
  defaultRepositoryId,
  isPending,
  onSubmit,
}: ReleaseNotesFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReleaseNotesFormValues>({
    resolver: zodResolver(releaseNotesSchema),
    defaultValues: {
      repository_id: defaultRepositoryId,
      start_date: "",
      end_date: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-xl mx-auto py-8 font-mono"
    >
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
          Repository <span className="text-primary">*</span>
        </Label>
        <Controller
          control={control}
          name="repository_id"
          render={({ field }) => (
            <ReleaseNotesRepoSelect
              repositories={repositories}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.repository_id && (
          <p className="text-[11px] text-red-400 font-sans">
            {errors.repository_id.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Start Date <span className="text-primary">*</span>
          </Label>
          <Controller
            control={control}
            name="start_date"
            render={({ field }) => (
              <ReleaseNotesDatePicker
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Select start date"
              />
            )}
          />
          {errors.start_date && (
            <p className="text-[11px] text-red-400 font-sans">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            End Date <span className="text-primary">*</span>
          </Label>
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <ReleaseNotesDatePicker
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Select end date"
              />
            )}
          />
          {errors.end_date && (
            <p className="text-[11px] text-red-400 font-sans">
              {errors.end_date.message}
            </p>
          )}
        </div>
      </div>

      {errors.end_date?.message?.includes("181") && (
        <div className="p-3 rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-sans flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Maximum date range is 181 calendar days.</span>
        </div>
      )}

      <div className="pt-4 flex justify-center">
        <Button
          type="submit"
          disabled={isPending}
          className="h-9 px-6 bg-transparent text-primary/80 border border-primary/50 hover:bg-primary/3 hover:text-primary text-xs font-semibold rounded-xs gap-2 font-mono cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Release Notes...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Notes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
