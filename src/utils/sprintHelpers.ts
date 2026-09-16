import { format, differenceInSeconds, parseISO } from "date-fns";
import type { SprintStatus } from "@/modules/user/sprints/types";

export function calculateSprintProgress(
  startDateStr: string | null,
  endDateStr: string | null,
  status: SprintStatus,
): number {
  if (status === "completed") return 100;
  if (!startDateStr || !endDateStr) return 0;

  const start = parseISO(startDateStr).getTime();
  const end = parseISO(endDateStr).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) return 0;

  const now = Date.now();

  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;

  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function formatSprintDates(
  startDateStr: string | null,
  endDateStr: string | null,
): string {
  if (!startDateStr || !endDateStr) return "Dates TBD";

  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  const startMonth = format(start, "MMM");
  const endMonth = format(end, "MMM");

  if (startMonth === endMonth) {
    return `${format(start, "MMM d")} - ${format(end, "d")}`;
  }

  return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  const diffInSeconds = Math.abs(differenceInSeconds(new Date(), date));

  if (diffInSeconds < 60) return "Updated just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Updated ${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `Updated ${weeks}w ago`;
}
