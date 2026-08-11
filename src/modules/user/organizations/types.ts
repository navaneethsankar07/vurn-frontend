export interface AccentColorOption {
  name: string;
  value: string;
}

export interface OrganizationOptionsResponse {
  icons: string[];
  accent_colors: AccentColorOption[];
}

export interface CreateOrganizationPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  accent_color?: string;
}

export interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  accent_color?: string;
}
