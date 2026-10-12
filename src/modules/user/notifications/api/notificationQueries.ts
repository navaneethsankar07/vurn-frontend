import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchUnreadCount, fetchUserNotifications } from "./notificationApi";

export function useUserNotifications(pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: ["user-notifications"],
    queryFn: ({ pageParam = 1 }) => fetchUserNotifications(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
  });
}
