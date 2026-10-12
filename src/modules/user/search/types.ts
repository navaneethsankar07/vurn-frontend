export interface SearchResultItem {
  id: string;
  entity_type: "project" | "issue" | "sprint" | string;
  entity_id: string;
  project_id?: string;
  project_key?: string;
  organization_slug?: string;
  project_slug?: string;
  key?: string;
  identifier?: string | null;
  title: string;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  issue_type?: string | null;
  updated_at: string;
}

export interface GlobalSearchResponse {
  query: string;
  page: number;
  page_size: number;
  total: number;
  results: SearchResultItem[];
}
