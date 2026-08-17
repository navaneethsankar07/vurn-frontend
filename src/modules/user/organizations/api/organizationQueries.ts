import { useQuery } from "@tanstack/react-query";
import {
  fetchOrganizationDashboard,
  fetchOrganizationOptions,
  fetchOrganizations,
} from "./organizationApi";
import type {
  OrganizationDashboardData,
  OrganizationQueryParams,
} from "../types";

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

const MOCK_EXTRAS = {
  recent_projects: [
    {
      id: "p1",
      code: "IGN",
      name: "Inference Gateway",
      description:
        "Low-latency routing layer for model inference across regions.",
      updated_at: "1h ago",
    },
    {
      id: "p2",
      code: "ART",
      name: "Agent Runtime",
      description: "Sandboxed execution environment for autonomous agents.",
      updated_at: "5h ago",
    },
    {
      id: "p3",
      code: "VEC",
      name: "Vector Store",
      description: "Managed embeddings storage with hybrid search.",
      updated_at: "Yesterday",
    },
    {
      id: "p4",
      code: "CON",
      name: "Console Web",
      description: "Customer-facing dashboard and admin surfaces.",
      updated_at: "2d ago",
    },
  ],
  active_sprints: [
    {
      id: "s1",
      project_code: "IGN",
      name: "Sprint 24 - Routing v2",
      start_date: "Jul 14",
      end_date: "Jul 28",
      progress: 62,
      status: "Active",
    },
    {
      id: "s2",
      project_code: "ART",
      name: "Sprint 12 - Sandbox hardening",
      start_date: "Jul 18",
      end_date: "Aug 01",
      progress: 34,
      status: "Active",
    },
    {
      id: "s3",
      project_code: "VEC",
      name: "Sprint 07 - Hybrid search",
      start_date: "Jul 28",
      end_date: "Aug 11",
      progress: 0,
      status: "Planning",
    },
  ],
  recent_activities: [
    {
      id: "a1",
      user: "Dane Whitfield",
      action: "created issue IGN-402",
      target: "Retry storm on cold regions",
      time: "18m ago",
    },
    {
      id: "a2",
      user: "Sprint bot",
      action: "started sprint",
      target: "Sandbox hardening",
      time: "2h ago",
    },
    {
      id: "a3",
      user: "Priya Nair",
      action: "commented on ART-119",
      target: '"Splitting this into two tickets."',
      time: "3h ago",
    },
    {
      id: "a4",
      user: "Sam Okoye",
      action: "joined the organization",
      target: "",
      time: "Yesterday",
    },
  ],
} as const;

export function useOrganizationDashboardQuery(slug?: string) {
  return useQuery({
    queryKey: organizationKeys.dashboard(slug),
    queryFn: async (): Promise<OrganizationDashboardData> => {
      if (!slug) {
        throw new Error("Organization slug is required");
      }

      const data = await fetchOrganizationDashboard(slug);

      return {
        id: Number(data.id),
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        logo_url: data.logo_url,
        accent_color: data.accent_color,

        total_projects: data.total_projects,
        total_members: data.total_members,
        active_sprints_count: data.active_sprints,
        open_issues: data.open_issues,
        completed_issues: data.completed_issues,

        recent_projects: [...MOCK_EXTRAS.recent_projects],
        active_sprints: [...MOCK_EXTRAS.active_sprints],
        recent_activities: [...MOCK_EXTRAS.recent_activities],
      };
    },
    enabled: Boolean(slug),
  });
}
