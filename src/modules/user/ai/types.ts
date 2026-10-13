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
