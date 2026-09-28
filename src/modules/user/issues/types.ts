export type WorkItemType = "epic" | "story" | "task" | "bug" | "subtask";
export type WorkItemPriority = "urgent" | "high" | "medium" | "low";

export interface IssueLabel {
  id: number;
  name: string;
  color: string;
}

export interface IssueItem {
  id: number;
  key: string;
  project_id: number;
  parent_key: string | null;
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
  message: string | null;
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

export interface IssueDetailResponse extends IssueItem {
  assignee_name?: string | null;
  reporter_name?: string | null;
  sprint_name?: string | null;
  due_date?: string | null;
  labels?: IssueLabel[];
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  parent_id?: number | null;
  sprint_id?: number | null;
  status_id?: number;
  assignee_id?: number | null;
  priority?: WorkItemPriority;
  story_points?: number | null;
}

export interface UpdateIssueParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  data: UpdateIssuePayload;
}

export interface AddIssueLabelPayload {
  label_id?: number;
  name?: string;
  color?: string;
}

export interface AddIssueLabelParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  data: AddIssueLabelPayload;
}

export interface RemoveIssueLabelParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  labelId: number | string;
}

export interface LabelQueryParams {
  search?: string;
}

export interface IssueDetailParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
}
export interface CommentReplyItem {
  id: number;
  issue_id?: number;
  parent_id?: number | null;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentItem {
  id: number;
  issue_id?: number;
  parent_id?: number | null;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  replies?: CommentReplyItem[];
}

export interface PaginatedCommentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommentItem[];
}

export interface GetIssueCommentsParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  page?: number;
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: number | null;
}

export interface CreateCommentParams {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  data: CreateCommentPayload;
}

export interface CreateCommentResponse {
  message: string;
  comment: {
    id: number;
    issue_id: number;
    parent_id: number | null;
    author_id: number;
    author_name: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
}
