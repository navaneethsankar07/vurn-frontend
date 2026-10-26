import api from "@/api/axios";
import type { RecentActivitiesParams, RecentActivityItem } from "../types";

export async function fetchRecentActivities(
  params: RecentActivitiesParams = { scope: "home" },
): Promise<RecentActivityItem[]> {
  const queryParams = new URLSearchParams();
  if (params.scope) queryParams.append("scope", params.scope);
  if (params.organization_slug)
    queryParams.append("organization_slug", params.organization_slug);
  if (params.project_slug)
    queryParams.append("project_slug", params.project_slug);
  if (params.sprint_id)
    queryParams.append("sprint_id", String(params.sprint_id));

  const response = await api.get(
    `/recent-activities/?${queryParams.toString()}`,
  );
  return response.data;
}