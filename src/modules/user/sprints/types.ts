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
