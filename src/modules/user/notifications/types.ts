export interface NotificationItem {
  id: number;
  type?: string;
  title: string;
  message: string;
  organization?: number | null;
  organization_name?: string | null;
  invitation?: number | null;
  project?: number | null;
  project_name?: string | null;
  issue?: number | null;
  issue_key?: string | null;
  sprint?: number | null;
  sprint_name?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}

export interface UnreadCountResponse {
  unread_count: number;
}
