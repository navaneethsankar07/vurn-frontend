export interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  icon?: string;
  accent_color?: string;
  start_date?: string;
  target_date?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent_color: string | null;
  logo_url: string | null;
  status: string;
  start_date: string | null;
  target_date: string | null;
  owner_id: number;
  project_lead_id: number;
  created_by_id: number;
  created_at: string;
}

export interface ProjectOptionsResponse {
  icons: string[];
  default_icon: string;
  default_accent_color: string;
}