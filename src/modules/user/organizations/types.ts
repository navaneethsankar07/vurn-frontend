export interface AccentColorOption {
  name: string;
  value: string;
}

export interface OrganizationOptionsResponse {
  icons: string[];
  accent_colors: AccentColorOption[];
}

export interface OrganizationAccess {
  role: "owner" | "admin" | "member";
  job_role: {
    id: number;
    name: string;
  } | null;
  permissions: string[];
  has_full_access: boolean;
  can_invite_members: boolean;
  can_create_projects: boolean;
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
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  logo_url?: string | null;
  accent_color?: string | null;
  total_projects: number;
  total_members: number;
  active_sprints_count: number;
  open_issues: number;
  completed_issues: number;

  recent_projects?: OrganizationProject[];
  active_sprints?: ActiveSprint[];
  recent_activities?: RecentActivity[];
}

export interface BackendDashboardResponse {
  id: string;
  name: string;
  description: string;
  updated_at: string;
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

export interface OrganizationSettings {
  name: string;
  slug: string;
  description: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationBranding {
  accent_color: string;
  icon: string;
  logo_url?: string | null;
}

export type UpdateSettingsPayload = Partial<OrganizationSettings>;
export type UpdateBrandingPayload = FormData | Partial<OrganizationBranding>;

export interface OrganizationPreferences {
  allow_admin_invitations: boolean;
  allow_member_invitations: boolean;
  allow_member_project_creation: boolean;
  updated_at: string;
}

export type UpdateOrganizationPreferencesPayload = Partial<
  Pick<
    OrganizationPreferences,
    | "allow_admin_invitations"
    | "allow_member_invitations"
    | "allow_member_project_creation"
  >
>;

export interface OrganizationRoles {
  id: number;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  members_count?: number;
  created_at: string;
  updated_at: string;
}

export interface RoleQueryParams {
  search?: string;
  ordering?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface PaginatedRolesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationRoles[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  color?: string;
  permissions: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  color?: string;
  permissions?: string[];
}

export interface PermissionOption {
  key: string;
  label: string;
}

export interface PermissionGroup {
  category: string;
  permissions: PermissionOption[];
}

export interface CreateRoleVariables {
  subdomain: string;
  payload: CreateRolePayload;
}

export interface UpdateRoleVariables {
  subdomain: string;
  roleId: string | number;
  payload: UpdateRolePayload;
}

export interface CreateInvitationRequest {
  email: string;
  permission_role?: string;
  job_role_id?: string;
  personal_message?: string;
  send_email?: boolean;
}

export interface CreateInvitationResponse {
  id: string;
  email: string;
  expires_at: string;
  invitation_url: string;
}

export interface ReceivedInvitation {
  id: number;
  organization_name: string;
  organization_slug: string;
  permission_role: "admin" | "member";
  job_role_name: string;
  token: string;
  personal_message?: string;
  expires_at: string;
  created_at: string;
}

export interface InvitationDetailResponse {
  organization: {
    name: string;
    slug: string;
    icon?: string;
  };
  job_role: {
    id: string;
    name: string;
  } | null;
  expires_at: string;
}

export interface AcceptInvitationResponse {
  message: string;
  organization_slug: string;
}

export interface OrganizationMember {
  id: number;
  membership_id: number | null;
  name: string;
  email: string;
  avatar: string | null;
  role: "owner" | "admin" | "member";
  job_role: {
    id: number;
    name: string;
  } | null;
  invited_by: {
    id: number;
    name: string;
  } | null;
  joined_at: string;
  project_count: number;
}

export interface GetOrganizationMembersParams {
  slug: string;
  search?: string;
  role?: "all" | "owner" | "admin" | "member";
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
