export interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  icon?: string;
  accent_color?: string;
  start_date?: string;
  target_date?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent_color: string | null;
  logo_url: string | null;
  status: string;
  start_date: string | null;
  target_date: string | null;
  owner_id: number;
  project_lead_id: number;
  created_by_id: number;
  created_at: string;
}

export interface ProjectOptionsResponse {
  icons: string[];
  default_icon: string;
  default_accent_color: string;
}

export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface ProjectListItem {
  id: string;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent_color: string | null;
  logo_url: string | null;
  status: string;
  start_date: string | null;
  target_date: string | null;
  owner: ProjectUser;
  project_lead: ProjectUser;
  created_at: string;
}

export interface ProjectListParams {
  search?: string;
  status?: string;
  archive?: "active" | "archived" | "all";
  sort?: "recently_created" | "recently_updated" | "name_asc" | "name_desc";
  page?: number;
  page_size?: number;
}

export interface PaginatedProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectListItem[];
}

export type ProjectStatus = "active" | "archived" | "completed";

export interface ProjectUpdateRequest {
  name?: string;
  key?: string;
  description?: string;
  status?: ProjectStatus;
  icon?: string;
  accent_color?: string;
  logo?: File | null;
}

export interface ProjectDetail {
  id: string;
  name: string;
  key: string;
  slug: string;
  description?: string;
  status: ProjectStatus;
  icon?: string;
  accent_color?: string;
  logo_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  message?: string;
}

export interface ProjectDeleteRequest {
  confirmation: string;
}

export interface ProjectMember {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  avatar: string | null;
  project_role: string;
  joined_at: string;
}

export interface ProjectMemberListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectMember[];
}

export interface GetProjectMembersParams {
  search?: string;
  role?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface AddProjectMemberPayload {
  user_id: number;
  project_role?: string;
}

export interface AddProjectMemberResponse {
  message: string;
}

export interface RemoveProjectMemberParams {
  orgSlug: string;
  projectSlug: string;
  memberId: number | string;
}

export interface RemoveProjectMemberResponse {
  message?: string;
  detail?: string;
}

export interface WorkflowStatus {
  id: number | string;
  name: string;
  category:
    "backlog" | "unstarted" | "started" | "completed" | "canceled" | string;
  color: string;
  icon: string;
  position: number;
  is_default: boolean;
  is_archived: boolean;
  allow_from_backlog: boolean;
  allow_incoming: boolean;
  allow_outgoing: boolean;
  description?: string;
  issue_count?: number;
}

export interface WorkflowOverviewResponse {
  id?: number | string;
  name?: string;
  description?: string;
  statuses: WorkflowStatus[];
  archived_statuses?: WorkflowStatus[];
}
