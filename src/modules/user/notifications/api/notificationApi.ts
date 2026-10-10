import api from "@/api/axios";
import type { NotificationItem, NotificationsResponse, UnreadCountResponse } from "../types";

export async function fetchUserNotifications(
  page: number = 1,
  pageSize: number = 10,
): Promise<NotificationsResponse> {
  const { data } = await api.get(
    `/notifications/?page=${page}&page_size=${pageSize}`,
  );
  return data;
}

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  const { data } = await api.get(`/notifications/unread-count/`);
  return data;
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<NotificationItem> {
  const { data } = await api.patch(`/notifications/${notificationId}/read/`);
  return data;
}