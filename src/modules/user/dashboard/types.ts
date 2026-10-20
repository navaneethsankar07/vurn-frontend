export interface DashboardIssue {
  id: number;
  key: string;
  title: string;
  status: string;
  status_category: string;
  priority: string;
  issue_type: string;
  created_at: string;
  updated_at: string;
  project_slug: string;
  project_name: string;
  organization_slug: string;
  organization_name: string;
}

export interface DashboardOrganization {
  id: number;
  name: string;
  slug: string;
  icon: string;
  accent_color: string;
  event_type: "joined" | "created" | string;
  event_date: string;
}

export interface DashboardRecentActivityResponse {
  recent_issues: DashboardIssue[];
  recent_organizations: DashboardOrganization[];
}
