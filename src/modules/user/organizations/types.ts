export interface AccentColorOption {
  name: string;
  value: string;
}

export interface OrganizationOptionsResponse {
  icons: string[];
  accent_colors: AccentColorOption[];
}

export interface CreateOrganizationPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  accent_color?: string;
}

export interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  accent_color?: string;
}

export type OrganizationRole = "owner" | "admin" | "member";

export interface Organization {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  icon: string;
  accent_color: string;
  logo_url: string | null;
  role: OrganizationRole;
  member_count: number;
  project_count: number;
  last_opened_at: string | null;
  is_pinned?: boolean;
}

export interface OrganizationsResponse {
  recent: Organization[];
  organizations: Organization[];
}

export type RoleFilter = "all" | "owner" | "member";
export type SortOption = "recent" | "name" | "member" | "project";
export type SortOrder = "asc" | "desc";

export interface OrganizationQueryParams {
  search?: string;
  role?: string;
  sort_by?: SortOption;
  order?: SortOrder;
  page?: number;
  page_size?: number;
}

export interface PaginatedOrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    recent: Organization[];
    pinned?: Organization[];
    organizations: Organization[];
  };
}

export interface OrganizationMetrics {
  total_projects: number;
  active_sprints: number;
  members_count: number;
  open_issues: number;
  completed_issues: number;
}

export interface OrganizationProject {
  id: string;
  code: string;
  name: string;
  description: string;
  updated_at: string;
}

export interface ActiveSprint {
  id: string;
  project_code: string;
  name: string;
  start_date: string;
  end_date: string;
  progress: number;
  status: "Active" | "Planning" | "Completed";
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface OrganizationDashboardData {
  id: string;
  name: string;
  description: string;
  metrics: OrganizationMetrics;
  recent_projects: OrganizationProject[];
  active_sprints: ActiveSprint[];
  recent_activities: RecentActivity[];
}

export interface BackendDashboardResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string | null;
  logo_url: string | null;
  accent_color: string | null;
  role: string;
  total_projects: number;
  total_members: number;
  active_sprints: number;
  open_issues: number;
  completed_issues: number;
}
