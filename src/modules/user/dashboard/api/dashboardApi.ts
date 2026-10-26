import api from "@/api/axios";
import type { DashboardRecentActivityResponse } from "../types";

export async function fetchDashboardRecentActivity(): Promise<DashboardRecentActivityResponse> {
  const response = await api.get("/recent-activity/");
  return response.data;
}