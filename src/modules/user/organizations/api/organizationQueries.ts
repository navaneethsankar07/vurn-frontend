import { useQuery } from "@tanstack/react-query";
import {
  fetchAiCreditPlans,
  fetchAiUsageHistory,
  fetchAiUsageStatistics,
  fetchCreditPurchaseHistory,
  fetchOrganizationDashboard,
  fetchOrganizationOptions,
  fetchOrganizationRoles,
  fetchOrganizations,
  getOrganizationAccess,
  getOrganizationMembers,
  getOrganizationPreferences,
  invitationApi,
} from "./organizationApi";
import type {
  GetOrganizationMembersParams,
  OrganizationQueryParams,
  RoleQueryParams,
} from "../types";
import { fetchRecentActivities } from "../../activities/api/recentActivitiesApi";

export const organizationKeys = {
  all: ["organizations"] as const,
  options: () => [...organizationKeys.all, "options"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params?: OrganizationQueryParams) =>
    [...organizationKeys.lists(), params] as const,
  detail: (slug?: string) => [...organizationKeys.all, "detail", slug] as const,
  dashboards: () => [...organizationKeys.all, "dashboard"] as const,
  dashboard: (slug?: string) =>
    [...organizationKeys.dashboards(), slug] as const,
};

export const preferenceKeys = {
  all: ["organization-preferences"] as const,
  detail: (slug: string) => [...preferenceKeys.all, slug] as const,
};

export const INVITATION_KEYS = {
  received: ["received-invitations"] as const,
  detail: (token: string) => ["invitation-detail", token] as const,
};

export const roleKeys = {
  all: (subdomain: string) => ["organization-roles", subdomain] as const,
  list: (subdomain: string, params?: RoleQueryParams) =>
    [...roleKeys.all(subdomain), "list", params] as const,
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

export function useOrganizationDetailQuery(slug?: string) {
  return useQuery({
    queryKey: organizationKeys.detail(slug),
    queryFn: async () => {
      if (!slug) throw new Error("Organization slug is required");
      return await fetchOrganizationDashboard(slug);
    },
    enabled: Boolean(slug),
  });
}

export function useOrganizationDashboardQuery(slug?: string) {
  return useQuery({
    queryKey: ["organization-dashboard", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Organization slug is required");
      }

      const [dashboardData, recentActivities] = await Promise.all([
        fetchOrganizationDashboard(slug),
        fetchRecentActivities({
          scope: "organization",
          organization_slug: slug,
        }),
      ]);

      return {
        ...dashboardData,
        remaining_ai_credits: dashboardData.completed_issues,
        recent_activities: recentActivities,
      };
    },
    enabled: Boolean(slug),
  });
}

export const useOrganizationPreferencesQuery = (subdomain: string) => {
  return useQuery({
    queryKey: preferenceKeys.detail(subdomain),
    queryFn: () => getOrganizationPreferences(subdomain),
    enabled: Boolean(subdomain),
  });
};

export const useOrganizationRolesQuery = (
  subdomain: string,
  params?: RoleQueryParams,
) => {
  return useQuery({
    queryKey: roleKeys.list(subdomain, params),
    queryFn: () => fetchOrganizationRoles(subdomain, params),
    enabled: Boolean(subdomain),
  });
};

export function useReceivedInvitationsQuery() {
  return useQuery({
    queryKey: INVITATION_KEYS.received,
    queryFn: () => invitationApi.getReceivedInvitations(),
  });
}

export function useInvitationDetailQuery(token: string) {
  return useQuery({
    queryKey: INVITATION_KEYS.detail(token),
    queryFn: () => invitationApi.getInvitationDetail(token),
    enabled: !!token,
  });
}

export const useOrganizationAccess = (slug: string) => {
  return useQuery({
    queryKey: ["organization-access", slug],

    queryFn: () => getOrganizationAccess(slug),

    enabled: Boolean(slug),

    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationMembers = (
  params: GetOrganizationMembersParams,
) => {
  return useQuery({
    queryKey: ["organization-members", params],
    queryFn: () => getOrganizationMembers(params),
    enabled: Boolean(params.slug),
  });
};

export function useAiUsageStatistics(organizationSlug: string) {
  return useQuery({
    queryKey: ["ai-usage-statistics", organizationSlug],
    queryFn: () => fetchAiUsageStatistics(organizationSlug),
    enabled: Boolean(organizationSlug),
  });
}

export function useAiUsageHistory(organizationSlug: string, page: number) {
  return useQuery({
    queryKey: ["ai-usage-history", organizationSlug, page],
    queryFn: () => fetchAiUsageHistory(organizationSlug, page),
    enabled: Boolean(organizationSlug),
    keepPreviousData: true,
  } as any);
}

export function useAiCreditPlans() {
  return useQuery({
    queryKey: ["ai-credit-plans"],
    queryFn: () => fetchAiCreditPlans(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreditPurchaseHistory(
  organizationSlug: string,
  page: number,
) {
  return useQuery({
    queryKey: ["ai-credit-purchase-history", organizationSlug, page],
    queryFn: () => fetchCreditPurchaseHistory(organizationSlug, page),
    enabled: Boolean(organizationSlug),
  });
}