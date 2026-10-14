export interface AiSubtaskItem {
  title: string;
  description: string;
}

export interface AiTaskBreakdownRequest {
  issue_title: string;
  issue_description?: string;
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
