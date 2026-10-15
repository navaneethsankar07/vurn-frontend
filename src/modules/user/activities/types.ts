export interface ActivityActor {
  id: number;
  username: string;
}

export interface RecentActivityItem {
  id: number;
  activity_type: string;
  description: string;
  actor: ActivityActor | null;
  project_name: string | null;
  sprint_name: string | null;
  issue_key: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export type ActivityScope = "home" | "organization" | "project" | "sprint";

export interface RecentActivitiesParams {
  scope?: ActivityScope;
  organization_slug?: string;
  project_slug?: string;
  sprint_id?: number | string;
}
