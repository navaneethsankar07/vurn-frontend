import { useRef, useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Plus } from "lucide-react";
import logo from "@/assets/logo.svg";
import { UserProfileMenu } from "@/modules/user/account/components/UserProfileMenu";
import { UserNotificationMenu } from "@/modules/user/notifications/component/modal/UserNotificationMenu";
import { CreateNewMenu } from "@/components/modals/CreateNewMenu";
import { useUnreadNotificationCount } from "@/modules/user/notifications/api/notificationQueries";
import { GlobalSearchInput } from "@/modules/user/search/components/GlobalSearchInput";
import { useModal } from "@/hooks/useModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const createNewModal = useModal(false);
  const navigate = useNavigate();

  const notificationRef = useRef<HTMLDivElement>(null);
  const createNewRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcuts({
    onNew: () => {
      createNewModal.toggleModal();
    },
    onNotifications: () => {
      setIsNotificationOpen((prev) => !prev);
    },
    onEscape: () => {
      createNewModal.closeModal();
      setIsNotificationOpen(false);
      setIsProfileMenuOpen(false);
    },
    onGoToOrganizations: () => {
      navigate("/organizations");
    },
    onGoToHome: () => {
      navigate("/dashboard");
    },
    onGoToDocs: () => {
      toast.error("Go to Docs shortcut only works inside a project workspace.");
    },
    onCreateIssue: () => {
      toast.error(
        "Create Issue shortcut only works inside a project workspace.",
      );
    },
    onRefreshRepository: () => {
      toast.error(
        "Refresh Repository (R) shortcut only works on the repository page inside a project.",
      );
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        createNewRef.current &&
        !createNewRef.current.contains(event.target as Node)
      ) {
        createNewModal.closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createNewModal]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black px-4 sm:px-6">
      <a href="/" className="flex items-center gap-2 sm:hidden">
        <span className="flex h-10 w-20 items-center justify-center rounded-xs text-black">
          <img src={logo} alt="" />
        </span>
      </a>

      <GlobalSearchInput />

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div
          className="relative block"
          ref={createNewRef}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            onClick={createNewModal.toggleModal}
            aria-expanded={createNewModal.isOpen}
            className="gap-1 rounded-0xl border-2 border-[#34343A] bg-secondary font-mono text-sm font-semibold text-white/80 hover:bg-hover-bg hover:text-text-primary cursor-pointer px-2.5 sm:px-4"
          >
            <Plus strokeLinecap="butt" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="hidden sm:inline" />
          </Button>

          {createNewModal.isOpen && (
            <div className="absolute -right-21 sm:-left-8 top-full z-50 mt-4">
              <CreateNewMenu onClose={createNewModal.closeModal} />
            </div>
          )}
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute -right-10 sm:-right-123 top-full z-50 mt-4">
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
            <div className="absolute right-0 sm:-right-5 top-full z-50 mt-2.5">
              <UserProfileMenu onClose={() => setIsProfileMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
