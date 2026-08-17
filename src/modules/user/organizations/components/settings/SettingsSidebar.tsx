import { NavLink } from "react-router-dom";
import {
  SlidersHorizontal,
  Palette,
  Lock,
  Plug,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const SETTINGS_NAV = [
  { label: "General", href: "/settings/general", icon: SlidersHorizontal },
  { label: "Branding", href: "/settings/branding", icon: Palette },
  { label: "Preferences", href: "/settings/preferences", icon: Lock },
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
  { label: "Billing", href: "/settings/billing", icon: CreditCard },
  {
    label: "Danger Zone",
    href: "/settings/danger",
    icon: AlertTriangle,
    danger: true,
  },
];

export function SettingsSidebar() {
  return (
    <aside className="w-full md:w-56 lg:w-60 lg:pl-8 lg:pt-6 flex flex-row md:flex-col gap-1 font-mono text-xs sm:text-sm border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 overflow-x-auto md:overflow-x-visible shrink-0 md:sticky md:top-6">
      {SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[#18181b] text-white"
                  : item.danger
                    ? "text-red-400 hover:bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-md" />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
}
