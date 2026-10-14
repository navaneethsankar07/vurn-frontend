export interface AiSubtaskItem {
  title: string;
  description: string;
}

export interface AiTaskBreakdownRequest {
  issue_title: string;
  issue_description?: string;
  organization_slug?: string | null;
}

export interface AiTaskBreakdownResponse {
  summary: string;
  subtasks: AiSubtaskItem[];
}

export interface AiEstimateRequest {
  issue_id: number | string;
}

export interface AiEstimateResponse {
  estimated_story_points: number;
  rationale: string;
  assumptions: string[];
  confidence: "low" | "medium" | "high";
}

export interface DuplicateIssueItem {
  issue_id: number;
  key: string;
  title: string;
  reason: string;
  confidence: "low" | "medium" | "high";
}

export interface AiDetectDuplicatesRequest {
  organization_slug: string;
  project_slug: string;
  title: string;
  description?: string;
  issue_type?: string;
  priority?: string;
}

export interface AiDetectDuplicatesResponse {
  duplicates: DuplicateIssueItem[];
}

export interface AiSprintSummaryRequest {
  organization_slug: string;
  project_slug: string;
  sprint_id: number;
}

export interface SprintInfo {
  id: number;
  name: string;
  goal?: string;
  description?: string;
  start_date: string;
  end_date: string;
  estimated_days: number;
  status: string;
}

export interface SprintMetrics {
  total_issues: number;
  completed_issues: number;
  incomplete_issues: number;
  completion_percentage: number;
  total_story_points: number;
  completed_story_points: number;
  issues_added: number;
  issues_removed: number;
  added_issue_keys: string[];
  removed_issue_keys: string[];
}

export interface SprintSummaryData {
  sprint: SprintInfo;
  metrics: SprintMetrics;
  summary: string;
  achievements: string[];
  incomplete_work: string[];
  scope_change_insights: string[];
  risks: string[];
  recommendations: string[];
}

export interface AiSprintSummaryResponse {
  summary: SprintSummaryData;
}

export interface ReleaseHighlightItem {
  category: string;
  title: string;
  description: string;
  references?: string[];
}

export interface ReleaseNotesObject {
  title: string;
  overview: string;
  highlights: ReleaseHighlightItem[];
  bug_fixes: ReleaseHighlightItem[];
  improvements: ReleaseHighlightItem[];
  breaking_changes: ReleaseHighlightItem[];
  known_issues: ReleaseHighlightItem[];
  technical_changes: ReleaseHighlightItem[];
  markdown: string;
}

export interface SourceSummary {
  commits_analyzed: number;
  merged_pull_requests_analyzed: number;
}

export interface AiReleaseNotesRequest {
  organization_slug: string;
  project_slug: string;
  repository_id: number;
  start_date: string;
  end_date: string;
}

export interface AiReleaseNotesResponse {
  release_notes: ReleaseNotesObject;
  source_summary: SourceSummary;
}
