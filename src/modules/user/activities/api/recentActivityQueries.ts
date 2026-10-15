import { useQuery } from "@tanstack/react-query";
import type { RecentActivitiesParams } from "../types";
import { fetchRecentActivities } from "./recentActivitiesApi";

export function useRecentActivities(params: RecentActivitiesParams) {
  return useQuery({
    queryKey: ["recent-activities", params],
    queryFn: () => fetchRecentActivities(params),
    enabled:
      params.scope === "home" ||
      (params.scope === "organization" && Boolean(params.organization_slug)) ||
      (params.scope === "project" &&
        Boolean(params.organization_slug) &&
        Boolean(params.project_slug)) ||
      (params.scope === "sprint" &&
        Boolean(params.organization_slug) &&
        Boolean(params.project_slug) &&
        Boolean(params.sprint_id)),
  });
}