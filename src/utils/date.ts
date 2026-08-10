import type { DateInput } from "../types/date";


export function formatDate(date: DateInput): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: DateInput): string {
  if (!date) return "Never";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Never";

  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateStr} · ${timeStr}`;
}

export function formatMonthYear(date: DateInput): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}


export function formatTimeAgo(date: DateInput): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}