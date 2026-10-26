import { useQuery } from "@tanstack/react-query";
import { fetchDashboardRecentActivity } from "./dashboardApi";

export function useDashboardRecentActivity() {
  return useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: fetchDashboardRecentActivity,
  });
}
