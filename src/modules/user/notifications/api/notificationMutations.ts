import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "./notificationApi";
import { toast } from "sonner";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
    onError: () => {
      toast.error("Failed to update notification status.");
    },
  });
}
