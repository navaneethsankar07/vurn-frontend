import { useQuery } from "@tanstack/react-query";
import { fetchUserNotifications } from "./notificationApi";

export function useUserNotifications(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["user-notifications", page, pageSize],
    queryFn: () => fetchUserNotifications(page, pageSize),
  });
}
