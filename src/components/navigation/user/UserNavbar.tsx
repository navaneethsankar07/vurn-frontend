import { useRef, useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Plus, Sparkles } from "lucide-react";

import { UserProfileMenu } from "@/modules/user/account/components/UserProfileMenu";
import { UserNotificationMenu } from "@/modules/user/notifications/component/modal/UserNotificationMenu";
import { useUnreadNotificationCount } from "@/modules/user/notifications/api/notificationQueries";
import { GlobalSearchInput } from "@/modules/user/search/components/GlobalSearchInput";

interface UserNavbarProps {
  hasUnreadNotifications?: boolean;
}

export function UserNavbar({ hasUnreadNotifications = true }: UserNavbarProps) {
  const avatar = useAppSelector((state) => state.auth.user?.avatar);
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount =
    unreadData?.unread_count ?? (hasUnreadNotifications ? 1 : 0);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black px-4 sm:px-6">
      <a href="/" className="flex items-center gap-2 sm:hidden">
        <span className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-amber-500 text-black">
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-lg font-bold tracking-tight">Vurn</span>
      </a>

      <GlobalSearchInput />

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button className="hidden gap-1 rounded-0xl border-2 border-[#34343A] bg-secondary font-mono text-sm font-semibold text-white/80 hover:bg-hover-bg hover:text-text-primary sm:flex">
          <Plus strokeLinecap="butt" />
          New
          <ChevronDown />
        </Button>

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <Bell className="h-4 w-4" />

            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-full z-50 mt-2.5">
              <UserNotificationMenu
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((previous) => !previous)}
            aria-label="Account menu"
            aria-expanded={isProfileMenuOpen}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#34343A] bg-white/5 hover:border-white/60 cursor-pointer"
          >
            <img
              src={avatar || "https://placehold.net/avatar.svg"}
              alt="Account"
              className="h-full w-full object-cover"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute -right-5 top-full z-50 mt-2.5">
              <UserProfileMenu onClose={() => setIsProfileMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
