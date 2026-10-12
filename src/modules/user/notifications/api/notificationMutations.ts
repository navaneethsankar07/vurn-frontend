import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notificationApi";
import { toast } from "sonner";
import type { NotificationsResponse, UnreadCountResponse } from "../types";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: ["user-notifications"] });
      await queryClient.cancelQueries({
        queryKey: ["notifications-unread-count"],
      });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>([
          "user-notifications",
          1,
          10,
        ]);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
      );

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(
          ["user-notifications", 1, 10],
          {
            ...previousNotifications,
            results: previousNotifications.results.map((item) =>
              item.id === notificationId ? { ...item, is_read: true } : item,
            ),
          },
        );
      }

      const targetItem = previousNotifications?.results.find(
        (i) => i.id === notificationId,
      );
      if (targetItem && !targetItem.is_read && previousUnreadCount) {
        queryClient.setQueryData<UnreadCountResponse>(
          ["notifications-unread-count"],
          {
            unread_count: Math.max(0, previousUnreadCount.unread_count - 1),
          },
        );
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["user-notifications", 1, 10],
          context.previousNotifications,
        );
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications-unread-count"],
          context.previousUnreadCount,
        );
      }
      toast.error("Failed to update notification status.");
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user-notifications"] });
      await queryClient.cancelQueries({
        queryKey: ["notifications-unread-count"],
      });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>([
          "user-notifications",
          1,
          10,
        ]);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
      );

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(
          ["user-notifications", 1, 10],
          {
            ...previousNotifications,
            results: previousNotifications.results.map((item) => ({
              ...item,
              is_read: true,
            })),
          },
        );
      }

      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
        { unread_count: 0 },
      );

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["user-notifications", 1, 10],
          context.previousNotifications,
        );
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          ["notifications-unread-count"],
          context.previousUnreadCount,
        );
      }
      toast.error("Failed to mark all notifications as read.");
    },
  });
}
