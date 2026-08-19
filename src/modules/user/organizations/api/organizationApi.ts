import api from "@/api/axios";
import type {
  BackendDashboardResponse,
  CreateOrganizationPayload,
  CreateOrganizationResponse,
  OrganizationBranding,
  OrganizationOptionsResponse,
  OrganizationPreferences,
  OrganizationQueryParams,
  OrganizationSettings,
  PaginatedOrganizationsResponse,
  PaginatedRolesResponse,
  RoleQueryParams,
  UpdateBrandingPayload,
  UpdateOrganizationPreferencesPayload,
  UpdateSettingsPayload,
} from "../types";

export async function fetchOrganizationOptions(): Promise<OrganizationOptionsResponse> {
  const response = await api.get<OrganizationOptionsResponse>(
    "/organizations/options/",
  );
  return response.data;
}

export async function createOrganization(
  data: CreateOrganizationPayload,
): Promise<CreateOrganizationResponse> {
  const response = await api.post<CreateOrganizationResponse>(
    "/organizations/",
    data,
  );
  return response.data;
}

export async function fetchOrganizations(
  params?: OrganizationQueryParams,
): Promise<PaginatedOrganizationsResponse> {
  const response = await api.get<PaginatedOrganizationsResponse>(
    "/organizations",
    { params },
  );
  return response.data;
}

export async function fetchOrganizationDashboard(
  slug: string,
): Promise<BackendDashboardResponse> {
  const response = await api.get<BackendDashboardResponse>(
    `/organizations/${slug}/dashboard/`,
  );
  return response.data;
}

export async function updateOrganizationSettings(
  slug: string,
  data: UpdateSettingsPayload,
): Promise<OrganizationSettings> {
  const response = await api.patch<OrganizationSettings>(
    `/organizations/${slug}/settings/`,
    data,
  );
  return response.data;
}

export async function updateOrganizationBranding(
  slug: string,
  data: UpdateBrandingPayload,
): Promise<OrganizationBranding> {
  const isFormData = data instanceof FormData;

  const response = await api.patch<OrganizationBranding>(
    `/organizations/${slug}/branding/`,
    data,
    isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined,
  );
  return response.data;
}

export async function archiveOrganization(slug: string): Promise<void> {
  await api.post(`/organizations/${slug}/archive/`);
}

export async function requestDeleteOrganization(
  slug: string,
  name: string,
): Promise<void> {
  await api.post(`/organizations/${slug}/delete/request/`, { name });
}

export async function confirmDeleteOrganization(
  slug: string,
  otp: string,
): Promise<void> {
  await api.post(`/organizations/${slug}/delete/confirm/`, { otp });
}

export const getOrganizationPreferences = async (
  slug: string,
): Promise<OrganizationPreferences> => {
  const response = await api.get(`/organizations/${slug}/preferences/`);
  console.log(response.data);

  return response.data;
};

export const updateOrganizationPreferences = async (
  slug: string,
  payload: UpdateOrganizationPreferencesPayload,
): Promise<OrganizationPreferences> => {
  const response = await api.patch(
    `/organizations/${slug}/preferences/`,
    payload,
  );
  return response.data;
};

export async function fetchOrganizationRoles(
  subdomain: string,
  params?: RoleQueryParams,
): Promise<PaginatedRolesResponse> {
  const response = await api.get<PaginatedRolesResponse>(
    `/organizations/${subdomain}/roles/`,
    { params },
  );
  return response.data;
}
