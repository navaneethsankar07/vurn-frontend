export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
  id: number;
  name: string;
  goal: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  status: SprintStatus;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  open_issues_count?: number;
  completed_issues_count?: number;
  remaining_issues_count?: number;
  assignees?: { id: number; name: string; avatar_url?: string }[];
}

export interface SprintsResponse {
  results: Sprint[];
  count: number;
}

export interface SprintDetailAPIResponse {
  id: number;
  name: string;
  goal: string;
  description: string;
  start_date: string;
  end_date: string;
  status: SprintStatus;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

export interface SprintMember {
  id: number;
  name: string;
  avatar?: string;
  isLead?: boolean;
}

export interface SprintIssue {
  key: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  assignee: SprintMember;
  storyPoints: number;
  updatedAt: string;
}

export interface SprintActivity {
  id: string;
  type: "created" | "added_issue";
  user: string;
  detail: string;
  timestamp: string;
}

export interface SprintDetailExtended extends SprintDetailAPIResponse {
  completionPercentage: number;
  members: SprintMember[];
  issues: SprintIssue[];
  activities: SprintActivity[];
  totalPoints: number;
  completedPoints: number;
  remainingPoints: number;
  openIssuesCount: number;
  completedIssuesCount: number;
  remainingIssuesCount: number;
}

export interface UseUpdateProjectSprintParams {
  subdomain: string;
  projectSlug: string;
  sprintId: string | number;
}
