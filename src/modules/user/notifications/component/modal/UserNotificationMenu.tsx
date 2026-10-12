import { useState } from "react";
import { Loader2, Bell } from "lucide-react";
import { useUserNotifications } from "../../api/notificationQueries";
import { useMarkNotificationAsRead } from "../../api/notificationMutations";
import { formatRelativeTime } from "@/utils/date";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  disablePushNotifications,
  enablePushNotifications,
} from "@/utils/pushNotifications";

interface UserNotificationMenuProps {
  onClose: () => void;
}

export function UserNotificationMenu({ onClose }: UserNotificationMenuProps) {
  const { data, isLoading } = useUserNotifications(1, 10);
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const notifications = data?.results || [];

  const handleNotificationClick = (item: {
    id?: number;
    pk?: number;
    is_read: boolean;
  }) => {
    const notificationId = item.id ?? item.pk;
    if (!item.is_read && notificationId) {
      markAsRead(Number(notificationId));
    } else if (!notificationId) {
      console.error("Notification object is missing an ID:", item);
    }
  };

  const handleEnablePush = async () => {
    try {
      setIsEnabling(true);
      const token = await enablePushNotifications();
      localStorage.setItem("vurn_fcm_token", token);
      toast.success("Push notifications enabled successfully.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to enable push notifications.");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisablePush = async () => {
    try {
      setIsDisabling(true);
      const token = localStorage.getItem("vurn_fcm_token");
      if (token) {
        await disablePushNotifications(token);
        localStorage.removeItem("vurn_fcm_token");
      }
      toast.success("Push notifications disabled.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to disable push notifications.");
    } finally {
      setIsDisabling(false);
    }
  };

  const hasToken = Boolean(localStorage.getItem("vurn_fcm_token"));

  return (
    <div className="w-80 sm:w-96 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl font-mono text-white text-xs z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/60">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-500" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            Notifications
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hasToken ? (
            <Button
              type="button"
              variant="outline"
              disabled={isEnabling}
              onClick={handleEnablePush}
              className="h-6 text-[10px] px-2 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-xs cursor-pointer"
            >
              {isEnabling && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Enable Push
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={isDisabling}
              onClick={handleDisablePush}
              className="h-6 text-[10px] px-2 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xs cursor-pointer"
            >
              {isDisabling && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Disable Push
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 italic">
            No notifications found.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 space-y-1 transition-colors cursor-pointer hover:bg-white/5 ${
                !item.is_read
                  ? "bg-amber-500/5 border-l-2 border-amber-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-200 font-sans text-xs flex items-center gap-1.5">
                  {!item.is_read && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  {item.title}
                </span>
                <span className="text-[10px] text-zinc-500 shrink-0">
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-white/5 bg-black/60 text-center">
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
