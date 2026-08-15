import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShieldCheck,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Members", href: "/members", icon: Users },
  { label: "Roles", href: "/roles", icon: ShieldCheck },
  { label: "Docs", href: "/docs", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function OrganizationSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 flex flex-col justify-between border-r border-white/10 bg-secondary p-4 font-mono transition-all duration-300 ease-in-out ${
        collapsed ? "w-16 px-2" : "w-56"
      }`}
    >
      <div className="w-full space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/"}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `relative flex items-center rounded-[3px] text-xs font-medium transition-colors ${
                  collapsed
                    ? "h-10 justify-start px-2.5"
                    : "justify-between px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-white/6 text-white"
                    : "text-gray-400 hover:bg-white/3 hover:text-white"
                }`
              }
            >
              <div className="flex items-center overflow-hidden">
                <Icon className="h-4 w-4 shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all ease-in-out ${
                    collapsed
                      ? "max-w-0 -translate-x-2 opacity-0 duration-150"
                      : "ml-3 max-w-37.5 translate-x-0 opacity-100 delay-100 duration-200"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="w-full border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? "Expand Sidebar" : undefined}
          className={`relative flex w-full items-center rounded-md text-xs font-medium text-gray-500 transition-colors hover:bg-white/3 hover:text-white ${
            collapsed ? "h-10 justify-start px-2.5" : "px-3 py-2.5"
          }`}
        >
          <div className="flex items-center overflow-hidden">
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <PanelLeftClose className="h-4 w-4 shrink-0" />
            )}
            <span
              className={`whitespace-nowrap transition-all ease-in-out ${
                collapsed
                  ? "max-w-0 -translate-x-2 opacity-0 duration-150"
                  : "ml-3 max-w-37.45 translate-x-0 opacity-100 delay-100 duration-200"
              }`}
            >
              Collapse Sidebar
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}