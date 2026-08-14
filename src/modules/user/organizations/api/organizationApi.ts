import api from "@/api/axios";
import type {
  BackendDashboardResponse,
  CreateOrganizationPayload,
  CreateOrganizationResponse,
  OrganizationOptionsResponse,
  OrganizationQueryParams,
  PaginatedOrganizationsResponse,
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
  slug: string
): Promise<BackendDashboardResponse> {
  const response = await api.get<BackendDashboardResponse>(
    `/organizations/${slug}/dashboard/`
  );
  return response.data;
}