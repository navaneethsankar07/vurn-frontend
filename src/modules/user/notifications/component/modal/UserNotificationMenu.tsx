import { Loader2, Bell } from "lucide-react";
import { useUserNotifications } from "../../api/notificationQueries";
import { formatRelativeTime } from "@/utils/date";

interface UserNotificationMenuProps {
  onClose: () => void;
}

export function UserNotificationMenu({ onClose }: UserNotificationMenuProps) {
  const { data, isLoading } = useUserNotifications(1, 10);
  const notifications = data?.results || [];

  return (
    <div className="w-80 sm:w-96 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl font-mono text-white text-xs z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/60">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-500" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            Notifications
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">
          {data?.count ?? 0} total
        </span>
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
              className={`p-3.5 space-y-1 transition-colors hover:bg-white/5 ${
                !item.is_read ? "bg-amber-500/5" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-200 font-sans text-xs">
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
          className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
