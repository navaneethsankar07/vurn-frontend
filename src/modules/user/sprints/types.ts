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
  created_by_name: string;
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

export interface StartSprintParams {
  subdomain: string;
  projectSlug: string;
  sprintId: string | number;
}

export interface StartSprintResponse {
  id: string | number;
  message: string;
}

export type SprintSortOption =
  | "name_asc"
  | "name_desc"
  | "start_date_asc"
  | "start_date_desc"
  | "end_date_asc"
  | "end_date_desc"
  | "created_asc"
  | "created_desc";

export interface ProjectSprintsQueryParams {
  search?: string;
  status?: SprintStatus;
  sort?: SprintSortOption;
  page?: number;
}

export type IssueType = "epic" | "story" | "task" | "bug" | "subtask";
export type IssuePriority = "urgent" | "high" | "medium" | "low";

export type KanbanSortOption =
  | "position"
  | "priority_asc"
  | "priority_desc"
  | "created_asc"
  | "created_desc"
  | "updated_asc"
  | "updated_desc";

export interface KanbanColumn {
  id: number;
  name: string;
  category: "backlog" | "todo" | "in_progress" | "done" | string;
  color: string;
  icon: string;
  position: number;
}

export interface KanbanBoardResponse {
  columns: KanbanColumn[];
}

export interface KanbanIssue {
  id: number;
  key: string;
  title: string;
  issue_type: IssueType;
  status_id: number;
  sprint_id: number | null;
  priority: IssuePriority;
  assignee_id: number | null;
  position: number;
  labels?: string[];
  story_points?: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumnIssuesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: KanbanIssue[];
}

export interface KanbanColumnIssuesParams {
  search?: string;
  sprint_id?: number | string;
  issue_type?: IssueType;
  assignee_id?: number | string;
  priority?: IssuePriority;
  sort?: KanbanSortOption;
  page?: number;
  page_size?: number;
}

export interface KanbanColumn {
  id: number;
  name: string;
  category: "backlog" | "todo" | "in_progress" | "done" | string;
  color: string;
  icon: string;
  position: number;
}

export interface KanbanBoardResponse {
  columns: KanbanColumn[];
}

export interface KanbanIssue {
  id: number;
  key: string;
  title: string;
  issue_type: IssueType;
  status_id: number;
  sprint_id: number | null;
  priority: IssuePriority;
  assignee_id: number | null;
  position: number;
  labels?: string[];
  story_points?: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumnIssuesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: KanbanIssue[];
}

export interface KanbanColumnIssuesParams {
  search?: string;
  sprint_id?: number | string;
  issue_type?: IssueType;
  assignee_id?: number | string;
  priority?: IssuePriority;
  sort?: KanbanSortOption;
  page?: number;
  page_size?: number;
}

export interface MoveIssueStatusPayload {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  status_id: number;
  from_status_id?: number;
}

export interface MoveIssueStatusResponse {
  id: number;
  status_id: number;
  position: number;
  message: string;
}

export interface UpdateIssuePositionPayload {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  status_id: number;
  position: number;
}

export interface UpdateIssuePositionResponse {
  id: number;
  status_id: number;
  position: number;
  message: string;
}

export interface BoardSprintOption {
  id: number;
  name: string;
}
