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

    const avatar = useAppSelector(state=>state.auth.user?.avatar)
    console.log(avatar);
    
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-black px-4 sm:px-6">
      <div className="flex shrink-0 items-center gap-3">
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

        <a href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-amber-500 text-black">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Vurn
          </span>
        </a>
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search resources or organizations..."
          className="h-10 border-white/10 bg-white/3 pl-9 pr-16 text-sm text-white placeholder:text-gray-500 focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-0 rounded-[3px]"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-[3px] border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:flex">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button className="hidden font-mono gap-1 bg-secondary text-white/80 text-sm font-semibold border-[#34343A] border-2 hover:text-text-primary  hover:bg-hover-bg sm:flex rounded-0xl">
          <Plus strokeLinecap="butt" />
          New
          <ChevronDown />
        </Button>

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

        <button
          type="button"
          aria-label="Account menu"
          className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#34343A] hover:border-white/60 bg-white/5"
        >
          <img
            src={avatar || "/placeholder-avatar.jpg"}
            alt="Account"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
