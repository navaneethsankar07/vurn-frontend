import api from "@/api/axios";
import type { NotificationsResponse } from "../types";

export async function fetchUserNotifications(
  page: number = 1,
  pageSize: number = 10,
): Promise<NotificationsResponse> {
  const { data } = await api.get(
    `/notifications/?page=${page}&page_size=${pageSize}`,
  );
  return data;
}
