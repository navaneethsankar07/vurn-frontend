import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { listenForForegroundMessages } from "@/utils/pushNotifications";
import { toast } from "sonner";

export function PushNotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      try {
        const cleanup = await listenForForegroundMessages((payload: any) => {
          const title = payload?.data?.title || "New Notification";
          const body = payload?.data?.body || "You have a new update.";

          toast(title, {
            description: body,
            action: {
              label: "View",
              onClick: () => {
                if (payload?.data?.url) {
                  window.location.href = payload.data.url;
                }
              },
            },
          });

          queryClient.invalidateQueries({
            queryKey: ["user-notifications"],
          });
          queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
          });
        });

        if (cancelled) {
          cleanup();
        } else {
          unsubscribe = cleanup;
        }
      } catch (error) {
        console.error("Failed to initialize foreground push listener:", error);
      }
    };

    void setup();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [queryClient]);

  return null;
}
