import { User, ShieldCheck, Trash2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "General",
    path: "/settings/general",
    icon: User,
    variant: "default",
  },
  {
    label: "Security",
    path: "/settings/security",
    icon: ShieldCheck,
    variant: "default",
  },
  {
    label: "Danger Zone",
    path: "/settings/danger-zone",
    icon: Trash2,
    variant: "danger",
  },
] as const;

export function SettingsLayout() {
  return (
    <div className="mx-auto max-w-6xl font-mono text-white">
      <div className="mb-6 border-b border-white/10 pb-5">
        <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
          Account
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Personal Settings
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 shrink-0 rounded-[3px] border border-white/10 bg-[#0C0C0E] p-3">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xs px-3.5 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? item.variant === "danger"
                          ? "bg-red-500/20 text-red-300 font-semibold"
                          : "bg-[#1C1C20] text-white font-semibold shadow-sm"
                        : item.variant === "danger"
                        ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? item.variant === "danger"
                              ? "text-red-400"
                              : "text-white"
                            : item.variant === "danger"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 w-full rounded-[3px] border border-white/10 bg-[#0C0C0E] p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}