import api from "@/api/axios";
import type {
  AcceptInvitationResponse,
  BackendDashboardResponse,
  CreateInvitationRequest,
  CreateInvitationResponse,
  CreateOrganizationPayload,
  CreateOrganizationResponse,
  CreateRolePayload,
  GetOrganizationMembersParams,
  InvitationDetailResponse,
  OrganizationAccess,
  OrganizationBranding,
  OrganizationMember,
  OrganizationOptionsResponse,
  OrganizationPreferences,
  OrganizationQueryParams,
  OrganizationRole,
  OrganizationRoles,
  OrganizationSettings,
  PaginatedOrganizationsResponse,
  PaginatedResponse,
  PaginatedRolesResponse,
  ReceivedInvitation,
  RoleQueryParams,
  UpdateBrandingPayload,
  UpdateOrganizationPreferencesPayload,
  UpdateRolePayload,
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

export const getOrganizationAccess = async (
  slug: string,
): Promise<OrganizationAccess> => {
  const response = await api.get(`/organizations/${slug}/access/`);
  console.log(response.data);

  return response.data;
};

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

export async function createOrganizationRole(
  subdomain: string,
  payload: CreateRolePayload,
): Promise<OrganizationRole> {
  const response = await api.post<OrganizationRole>(
    `/organizations/${subdomain}/roles/`,
    payload,
  );
  return response.data;
}

export async function updateOrganizationRole(
  subdomain: string,
  roleId: number,
  payload: UpdateRolePayload,
): Promise<OrganizationRoles> {
  const response = await api.patch<OrganizationRoles>(
    `/organizations/${subdomain}/roles/${roleId}/`,
    payload,
  );
  return response.data;
}

export const invitationApi = {
  createInvitation: async (slug: string, data: CreateInvitationRequest) => {
    const res = await api.post<CreateInvitationResponse>(
      `/organizations/${slug}/invitations/`,
      data,
    );
    return res.data;
  },

  getReceivedInvitations: async () => {
    const res = await api.get<ReceivedInvitation[]>(
      `/organizations/invitations/received/`,
    );
    return res.data;
  },

  getInvitationDetail: async (token: string) => {
    const res = await api.get<InvitationDetailResponse>(
      `/organizations/invitations/${token}/`,
    );
    return res.data;
  },

  acceptInvitation: async (token: string) => {
    const res = await api.post<AcceptInvitationResponse>(
      `/organizations/invitations/${token}/accept/`,
    );
    return res.data;
  },
};

export const getOrganizationMembers = async ({
  slug,
  search,
  role,
  page = 1,
  page_size = 10,
}: GetOrganizationMembersParams): Promise<
  PaginatedResponse<OrganizationMember>
> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (role && role !== "all") params.append("role", role);
  params.append("page", page.toString());
  params.append("page_size", page_size.toString());

  const response = await api.get(
    `/organizations/${slug}/members/?${params.toString()}`,
  );
  return response.data;
};
