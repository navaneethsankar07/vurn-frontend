import { useQuery } from "@tanstack/react-query";
import {
  fetchOrganizationOptions,
  fetchOrganizations,
} from "./organizationApi";
import type { OrganizationQueryParams } from "../types";

export const organizationKeys = {
  all: ["organizations"] as const,
  options: () => [...organizationKeys.all, "options"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params?: OrganizationQueryParams) =>
    [...organizationKeys.lists(), params] as const,
};

export function useOrganizationOptionsQuery() {
  return useQuery({
    queryKey: organizationKeys.options(),
    queryFn: fetchOrganizationOptions,
    staleTime: 1000 * 60 * 60,
  });
}

export function useOrganizationsQuery(params?: OrganizationQueryParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => fetchOrganizations(params),
    refetchOnMount: "always",
  });
}
