import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerPopoverProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
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

export function DatePickerPopover({
  value,
  onChange,
  placeholder,
}: DatePickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentOrPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
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
        className="h-9 w-full px-3 flex items-center justify-between border border-white/10 bg-black text-white rounded-xs text-xs font-mono focus:ring-1 focus:ring-amber-500 hover:border-white/20 transition-colors"
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
        className="w-64 p-3 bg-[#09090B] border border-white/10 text-white rounded-xs font-mono shadow-2xl space-y-3"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-semibold text-zinc-200">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isCurrentOrPastMonth}
              onClick={handlePrevMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xs"
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
            const targetDate = new Date(viewYear, viewMonth, day);
            const isPast = targetDate <= today;
            const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = value === formatted;

            return (
              <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={() => handleSelectDay(day)}
                className={`h-7 w-7 rounded-xs flex items-center justify-center text-xs transition-colors ${
                  isPast
                    ? "text-zinc-600 cursor-not-allowed opacity-40"
                    : isSelected
                      ? "bg-amber-500 text-black font-semibold"
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
