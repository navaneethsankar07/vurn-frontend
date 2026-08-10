export interface LogoutResponse {
  message: string;
}

export interface ProfileUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  avatar: string | null;
  created_at: string;
  last_login: string | null;
}

export type ProfileActivityType =
  | "issue_created"
  | "comment_added"
  | "issue_closed"
  | "invitation_accepted"
  | "organization_joined";

export interface ProfileActivity {
  type: ProfileActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface ProfileStatistics {
  organizations_joined: number;
  projects: number;
  assigned_issues: number;
  completed_issues: number;
  comments: number;
  github_linked_projects: number;
}

export interface ProfileResponse {
  user: ProfileUser;
  statistics: ProfileStatistics;
  recent_activity: ProfileActivity[];
}

export interface ProfileHeaderCardProps {
  user: ProfileUser;
  onTokenTransactionsClick?: () => void;
}

export interface PersonalInfoCardProps {
  user: ProfileUser;
}

export interface ProfileStatsCardProps {
  statistics: ProfileStatistics;
}

export interface RecentActivityCardProps {
  activities: ProfileActivity[];
}
