import { type SprintStatus } from "@/modules/user/sprints/types";

export function calculateSprintProgress(
  startDateStr: string | null,
  endDateStr: string | null,
  status: SprintStatus,
): number {
  if (status === "completed") return 100;
  if (status === "planned" || !startDateStr || !endDateStr) return 0;

  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const now = new Date().getTime();

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

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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
