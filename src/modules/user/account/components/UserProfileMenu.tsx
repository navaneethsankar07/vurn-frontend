import { Link } from "react-router-dom";
import { User, Sliders, Keyboard, BookOpen, LogOut } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/modules/public/auth/authSlice";
import { useLogoutMutation } from "../api/accountMutations";

interface UserProfileMenuProps {
  onClose: () => void;
}

export function UserProfileMenu({ onClose }: UserProfileMenuProps) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const logoutMutation = useLogoutMutation();

  if (!user) {
    return null;
  }

  const initials = user.full_name
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        console.log(response.message);

        dispatch(logout());
        localStorage.removeItem("hasSession");
        onClose();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const menuItems = [
    {
      label: "Your Profile",
      icon: User,
      href: "/profile",
    },
    {
      label: "Personal Settings",
      icon: Sliders,
      href: "/settings/personal",
    },
    {
      label: "Keyboard Shortcuts",
      icon: Keyboard,
      href: "/shortcuts",
    },
    {
      label: "Help & Documentation",
      icon: BookOpen,
      href: "/help",
    },
  ];

  return (
    <div className="w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-[3px] border border-white/10 bg-[#0F0F10] font-mono text-sm text-gray-300 shadow-xl">
      <div className="flex items-center gap-3.5 border-b border-white/10 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-[#18181B] text-base font-semibold text-white">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-base font-semibold leading-snug text-white">
            {user.full_name}
          </span>

          <span className="truncate text-xs text-gray-400">{user.email}</span>

          <span className="truncate text-xs text-gray-500">
            @{user.username}
          </span>
        </div>
      </div>

      <div className="space-y-0.5 p-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-[3px] px-3 py-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <item.icon className="h-4 w-4 shrink-0 text-gray-400" />

            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-white/10 p-1">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-[3px] px-3 py-2.5 text-left text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0 text-gray-400" />

          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
