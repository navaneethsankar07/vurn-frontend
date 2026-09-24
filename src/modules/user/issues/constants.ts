import { Layers, Bookmark, CheckSquare, Bug, GitFork } from "lucide-react";
import type { WorkItemType, WorkItemPriority } from "./types";

export const WORK_ITEM_TYPES: {
  value: WorkItemType;
  label: string;
  icon: typeof Layers;
  color: string;
  description: string;
}[] = [
  {
    value: "epic",
    label: "Epic",
    icon: Layers,
    color: "#A855F7",
    description: "Large feature or strategic initiative",
  },
  {
    value: "story",
    label: "Story",
    icon: Bookmark,
    color: "#22C55E",
    description: "User-focused requirement deliverable",
  },
  {
    value: "task",
    label: "Task",
    icon: CheckSquare,
    color: "#3B82F6",
    description: "Standard development or design work",
  },
  {
    value: "bug",
    label: "Bug",
    icon: Bug,
    color: "#EF4444",
    description: "Defect or issue that needs fixing",
  },
  {
    value: "subtask",
    label: "Sub-task",
    icon: GitFork,
    color: "#64748B",
    description: "Granular work nested under an item",
  },
];

export const WORK_ITEM_PRIORITIES: {
  value: WorkItemPriority;
  label: string;
  color: string;
}[] = [
  { value: "urgent", label: "Urgent", color: "#EF4444" },
  { value: "high", label: "High", color: "#F59E0B" },
  { value: "medium", label: "Medium", color: "#3B82F6" },
  { value: "low", label: "Low", color: "#71717A" },
];

export const WORK_ITEM_SORT_OPTIONS = [
  { value: "-created_at", label: "Recently Created" },
  { value: "created_at", label: "Oldest Created" },
  { value: "-updated_at", label: "Recently Updated" },
  { value: "updated_at", label: "Least Recently Updated" },
  { value: "priority", label: "Priority: Highest" },
  { value: "-priority", label: "Priority: Lowest" },
];
