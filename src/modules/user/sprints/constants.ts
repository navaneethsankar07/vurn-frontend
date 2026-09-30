import type { SprintDetailExtended } from "./types";

export const DUMMY_SPRINT_EXTENDED: Omit<
  SprintDetailExtended,
  | "id"
  | "name"
  | "goal"
  | "description"
  | "start_date"
  | "end_date"
  | "status"
  | "estimated_days"
  | "created_by_id"
  | "created_by_name"
  | "created_at"
  | "updated_at"
  | "issues"
> = {
  completionPercentage: 38,
  members: [
    { id: 101, name: "Priya Raman", isLead: true },
    { id: 102, name: "Chen Wei", isLead: false },
  ],
  activities: [
    {
      id: "act-1",
      type: "created",
      user: "Priya Raman",
      detail: "created the sprint",
      timestamp: "2d ago",
    },
  ],
  totalPoints: 25,
  completedPoints: 13,
  remainingPoints: 12,
  openIssuesCount: 1,
  completedIssuesCount: 3,
  remainingIssuesCount: 2,
};

export const ISSUE_TYPES = [
  { value: "all", label: "Type: All" },
  { value: "epic", label: "Epic" },
  { value: "story", label: "Story" },
  { value: "task", label: "Task" },
  { value: "bug", label: "Bug" },
  { value: "subtask", label: "Subtask" },
];

export const ISSUE_PRIORITIES = [
  { value: "all", label: "Priority: All" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const KANBAN_SORT_OPTIONS = [
  { value: "position", label: "Position" },
  { value: "priority_desc", label: "Priority: High to Low" },
  { value: "priority_asc", label: "Priority: Low to High" },
  { value: "updated_desc", label: "Updated: Newest" },
  { value: "updated_asc", label: "Updated: Oldest" },
  { value: "created_desc", label: "Created: Newest" },
  { value: "created_asc", label: "Created: Oldest" },
];
