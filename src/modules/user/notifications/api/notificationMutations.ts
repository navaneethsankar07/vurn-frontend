import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notificationApi";
import { toast } from "sonner";
import type { UnreadCountResponse } from "../types";

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

      const previousData = queryClient.getQueryData<any>([
        "user-notifications",
      ]);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
      );

      if (previousData) {
        queryClient.setQueryData(["user-notifications"], {
          ...previousData,
          pages: previousData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((item: any) =>
              item.id === notificationId || item.pk === notificationId
                ? { ...item, is_read: true }
                : item,
            ),
          })),
        });
      }

      let wasUnread = false;
      previousData?.pages?.forEach((page: any) => {
        const found = page.results.find(
          (i: any) => i.id === notificationId || i.pk === notificationId,
        );
        if (found && !found.is_read) wasUnread = true;
      });

      if (wasUnread && previousUnreadCount) {
        queryClient.setQueryData<UnreadCountResponse>(
          ["notifications-unread-count"],
          {
            unread_count: Math.max(0, previousUnreadCount.unread_count - 1),
          },
        );
      }

      return { previousData, previousUnreadCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["user-notifications"], context.previousData);
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

      const previousData = queryClient.getQueryData<any>([
        "user-notifications",
      ]);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
      );

      if (previousData) {
        queryClient.setQueryData(["user-notifications"], {
          ...previousData,
          pages: previousData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((item: any) => ({
              ...item,
              is_read: true,
            })),
          })),
        });
      }

      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications-unread-count"],
        { unread_count: 0 },
      );

      return { previousData, previousUnreadCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["user-notifications"], context.previousData);
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
