// api/organizationQueries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchOrganizationOptions } from "./organizationApi";

export const organizationKeys = {
  all: ["organizations"] as const,
  options: () => [...organizationKeys.all, "options"] as const,
};

export function useOrganizationOptionsQuery() {
  return useQuery({
    queryKey: organizationKeys.options(),
    queryFn: fetchOrganizationOptions,
    staleTime: 1000 * 60 * 60,
  });
}
