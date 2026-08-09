import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import { UserProfileMenu } from "@/modules/user/account/components/UserProfileMenu";

interface UserNavbarProps {
  onCollapseToggle?: () => void;
  isSidebarCollapsed?: boolean;
  hasUnreadNotifications?: boolean;
}

export function UserNavbar({
  onCollapseToggle,
  isSidebarCollapsed = false,
  hasUnreadNotifications = true,
}: UserNavbarProps) {
  const avatar = useAppSelector((state) => state.auth.user?.avatar);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-black px-4 sm:px-6">
      {/* Sidebar Toggle */}
      <button
        type="button"
        onClick={onCollapseToggle}
        aria-label={
          isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
        }
        className="hidden h-8 w-8 items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white sm:flex"
      >
        {isSidebarCollapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-amber-500 text-black">
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
        </span>

        <span className="hidden text-lg font-bold tracking-tight sm:inline">
          Vurn
        </span>
      </a>

      {/* Search */}
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

        <Input
          type="search"
          placeholder="Search resources or organizations..."
          className="h-10 rounded-[3px] border-white/10 bg-white/3 pl-9 pr-16 text-sm text-white placeholder:text-gray-500 focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-0"
        />

        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-[3px] border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:flex">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>

      {/* Right Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button className="hidden gap-1 rounded-0xl border-2 border-[#34343A] bg-secondary font-mono text-sm font-semibold text-white/80 hover:bg-hover-bg hover:text-text-primary sm:flex">
          <Plus strokeLinecap="butt" />
          New
          <ChevronDown />
        </Button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell className="h-4 w-4" />

          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsProfileMenuOpen((previous) => !previous)
            }
            aria-label="Account menu"
            aria-expanded={isProfileMenuOpen}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#34343A] bg-white/5 hover:border-white/60"
          >
            <img
              src={avatar || "/placeholder-avatar.jpg"}
              alt="Account"
              className="h-full w-full object-cover"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute -right-5 top-full z-50 mt-2.5">
              <UserProfileMenu
                onClose={() => setIsProfileMenuOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}