export type WorkItemType = "epic" | "story" | "task" | "bug" | "subtask";
export type WorkItemPriority = "urgent" | "high" | "medium" | "low";

export interface IssueItem {
  id: number;
  key: string;
  project_id: number;
  parent_id: number | null;
  sprint_id: number | null;
  status_id: number;
  status_name: string;
  assignee_id: number | null;
  reporter_id: number;
  issue_number: number;
  issue_type: WorkItemType;
  title: string;
  description: string;
  priority: WorkItemPriority;
  story_points: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIssuePayload {
  issue_type: WorkItemType;
  title: string;
  description?: string;
  parent_id?: number | null;
  sprint_id?: number | null;
  status_id?: number;
  assignee_id?: number | null;
  priority: WorkItemPriority;
  story_points?: number | null;
}

export interface CreateIssueParams {
  subdomain: string;
  projectSlug: string;
  data: CreateIssuePayload;
}

export interface IssueListParams {
  search?: string;
  issue_type?: WorkItemType;
  parent_id?: number | string;
  epic_id?: number | string;
  story_id?: number | string;
  sprint_id?: number | string;
  assignee_id?: number | string;
  priority?: WorkItemPriority;
  status_id?: number | string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface IssueListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IssueItem[];
}
