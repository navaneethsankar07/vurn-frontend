import type { SprintDetailExtended } from "./types"

export const DUMMY_SPRINT_EXTENDED: Omit<
  SprintDetailExtended,
  | "id"
  | "name"
  | "goal"
  | "description"
  | "start_date"
  | "end_date"
  | "status"
  | "created_by_id"
  | "created_at"
  | "updated_at"
> = {
  completionPercentage: 38,
  members: [
    { id: 101, name: "Priya Raman", isLead: true },
    { id: 102, name: "Chen Wei", isLead: false },
  ],
  issues: [
    {
      key: "INF-231",
      title: "JWT authentication rotation",
      status: "Done",
      priority: "High",
      assignee: { id: 101, name: "Priya Raman" },
      storyPoints: 5,
      updatedAt: "2d ago",
    },
    {
      key: "INF-236",
      title: "Repository integration sync",
      status: "Done",
      priority: "Medium",
      assignee: { id: 102, name: "Chen Wei" },
      storyPoints: 3,
      updatedAt: "2d ago",
    },
    {
      key: "INF-238",
      title: "Notification system delivery",
      status: "Done",
      priority: "Medium",
      assignee: { id: 101, name: "Priya Raman" },
      storyPoints: 5,
      updatedAt: "1d ago",
    },
    {
      key: "INF-240",
      title: "Workflow engine state machine",
      status: "In Progress",
      priority: "High",
      assignee: { id: 102, name: "Chen Wei" },
      storyPoints: 8,
      updatedAt: "4h ago",
    },
    {
      key: "INF-242",
      title: "Documentation improvements",
      status: "In Progress",
      priority: "Low",
      assignee: { id: 101, name: "Priya Raman" },
      storyPoints: 2,
      updatedAt: "4h ago",
    },
    {
      key: "INF-245",
      title: "Rate-limit token verification path",
      status: "Todo",
      priority: "Low",
      assignee: { id: 101, name: "Priya Raman" },
      storyPoints: 2,
      updatedAt: "3d ago",
    },
  ],
  activities: [
    {
      id: "act-1",
      type: "added_issue",
      user: "Priya Raman",
      detail: "added INF-245 to the sprint",
      timestamp: "3h ago",
    },
    {
      id: "act-2",
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
