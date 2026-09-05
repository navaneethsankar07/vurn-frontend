import { NavLink, useParams } from "react-router-dom";
import { SlidersHorizontal, AlertTriangle } from "lucide-react";
import { GithubIcon } from "@/utils/icons";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isDanger?: boolean;
}

const SETTINGS_NAV_ITEMS: NavItem[] = [
  { label: "General", path: "general", icon: SlidersHorizontal },
  { label: "GitHub Integration", path: "github", icon: GithubIcon },
  {
    label: "Danger Zone",
    path: "danger-zone",
    icon: AlertTriangle,
    isDanger: true,
  },
];

export function ProjectSettingsSidebar() {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav className="flex flex-col gap-1">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const targetPath = `/projects/${projectSlug}/settings/${item.path}`;

          return (
            <NavLink
              key={item.path}
              to={targetPath}
              className={({ isActive }) => {
                const baseClasses =
                  "flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-medium transition-all duration-150";

                if (isActive) {
                  return `${baseClasses} bg-neutral-800/80 text-white shadow-sm border border-neutral-700/50`;
                }

                if (item.isDanger) {
                  return `${baseClasses} text-red-400 hover:text-red-300 hover:bg-neutral-900/60`;
                }

                return `${baseClasses} text-neutral-400 hover:text-white hover:bg-neutral-900/60`;
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
