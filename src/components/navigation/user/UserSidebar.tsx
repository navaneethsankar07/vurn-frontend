import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";

interface UserSidebarProps {
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
}

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Organizations", icon: Building2, href: "/organizations" },
  { label: "Invitations", icon: Mail, href: "/invitations", count: 2 },
];

export function UserSidebar({
  isCollapsed = false,
  onCollapseToggle,
}: UserSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`hidden shrink-0 flex-col justify-between border-r border-white/10 bg-secondary transition-all duration-300 ease-in-out sm:flex ${
        isCollapsed ? "w-16 p-2" : "w-64 p-4"
      }`}
    >
      <div className="w-full space-y-4">
        <div
          className={`flex h-10 items-center justify-between ${
            isCollapsed ? "justify-center px-0" : "px-2"
          }`}
        >
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] bg-amber-500 text-black">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </span>

            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight text-white">
                Vurn
              </span>
            )}
          </a>

          {!isCollapsed && (
            <button
              type="button"
              onClick={onCollapseToggle}
              aria-label="Collapse sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            type="button"
            onClick={onCollapseToggle}
            aria-label="Expand sidebar"
            className="flex h-10 w-full items-center justify-center rounded-[3px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}

        <nav className="w-full space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.label}
                to={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center rounded-[3px] text-sm font-medium transition-colors ${
                  isCollapsed
                    ? "h-10 justify-start px-2.5"
                    : "justify-between px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-white/6 text-white"
                    : "text-gray-400 hover:bg-white/3 hover:text-white"
                }`}
              >
                <div className="flex items-center overflow-hidden">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all ease-in-out ${
                      isCollapsed
                        ? "max-w-0 -translate-x-2 opacity-0 duration-150"
                        : "ml-3 max-w-37.5 translate-x-0 opacity-100 delay-100 duration-200"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={
                      isCollapsed
                        ? "absolute -right-1 -top-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white/10 px-1 font-mono text-[10px] font-semibold text-primary transition-all duration-300 ease-in-out"
                        : "inline-flex items-center justify-center rounded-[3px] bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-gray-300 transition-all duration-300 ease-in-out"
                    }
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-full border-t border-white/10 pt-4">
        <Link
          to="/settings/general"
          title={isCollapsed ? "Settings" : undefined}
          className={`relative flex items-center rounded-md text-sm font-medium text-gray-400 transition-colors hover:bg-white/3 hover:text-white ${
            isCollapsed ? "h-10 justify-start px-2.5" : "px-3 py-2.5"
          } ${
            location.pathname === "/settings" ? "bg-white/6 text-white" : ""
          }`}
        >
          <div className="flex items-center overflow-hidden">
            <Settings className="h-4 w-4 shrink-0" />
            <span
              className={`whitespace-nowrap transition-all ease-in-out ${
                isCollapsed
                  ? "max-w-0 -translate-x-2 opacity-0 duration-150"
                  : "ml-3 max-w-37.45 translate-x-0 opacity-100 delay-100 duration-200"
              }`}
            >
              Settings
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
