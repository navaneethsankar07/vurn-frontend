import api from "@/api/axios";
import type {
  CreateOrganizationPayload,
  CreateOrganizationResponse,
  OrganizationOptionsResponse,
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
