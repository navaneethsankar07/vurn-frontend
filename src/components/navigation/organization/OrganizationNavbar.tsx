import { useState } from "react";
import {
  Sparkles,
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { getSubdomain } from "@/utils/subdomain";
import { getOrganizationUrl } from "@/utils/organizationUrl";

interface OrganizationNavbarProps {
  currentOrgName?: string;
}

export function OrganizationNavbar({
  currentOrgName,
}: OrganizationNavbarProps) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  console.log(user);
  

  const currentSubdomain = getSubdomain();

  const port = window.location.port ? `:${window.location.port}` : "";
  const rawBaseDomain = import.meta.env.VITE_APP_BASE_DOMAIN || "lvh.me";
  const cleanBaseDomain = rawBaseDomain.split(":")[0];
  const baseHost = `${cleanBaseDomain}${port}`;
  const protocol = window.location.protocol;

  const handleBaseDomainNavigate = (path: string) => {
    window.location.href = `${protocol}//${baseHost}${path}`;
  };

  const handleSwitchOrg = (slug: string) => {
    setOrgDropdownOpen(false);
    window.location.href = getOrganizationUrl(slug);
  };

  // Derive initial for fallback avatar
  const fallbackInitial = user?.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  // Formatted display name for current workspace
  const activeOrgName =
    currentOrgName || (currentSubdomain ? currentSubdomain : "Workspace");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030303] font-mono">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Logo & Org Switcher */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleBaseDomainNavigate("/dashboard")}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 text-black">
              <Sparkles className="h-3.5 w-3.5 fill-black" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">
              Vurn
            </span>
          </button>

          <div className="h-4 w-px bg-white/10" />

          {/* Org Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOrgDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded border border-white/10 bg-[#09090b] px-2.5 py-1 text-xs text-gray-300 hover:border-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-500 uppercase leading-none">
                  Organization
                </span>
                <span className="font-semibold text-white leading-tight capitalize">
                  {activeOrgName}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
            </button>

            {orgDropdownOpen && (
              <div className="absolute left-0 mt-1 w-56 rounded border border-white/10 bg-[#09090b] py-1 shadow-xl z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase text-gray-500 font-semibold">
                  Your Organizations
                </div>

                {user?.organizations && user.organizations.length > 0 ? (
                  user.organizations.map((slug) => {
                    const isCurrent =
                      currentSubdomain?.toLowerCase() === slug.toLowerCase();
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => handleSwitchOrg(slug)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors cursor-pointer ${
                          isCurrent
                            ? "text-white bg-white/5 font-semibold"
                            : "text-gray-300"
                        }`}
                      >
                        <Building2
                          className={`h-3.5 w-3.5 ${
                            isCurrent ? "text-amber-500" : "text-gray-500"
                          }`}
                        />
                        <span className="truncate capitalize">{slug}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-xs">
                    No organizations found
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setOrgDropdownOpen(false);
                    handleBaseDomainNavigate("/organizations");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-amber-500 hover:bg-white/5 transition-colors border-t border-white/5 cursor-pointer"
                >
                  View All Organizations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search resources, organizations, or members..."
              className="w-full rounded border border-white/10 bg-[#09090b] pl-9 pr-12 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded border border-white/10 bg-[#09090b] px-3 py-1 text-xs font-medium text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </button>

          <button
            type="button"
            className="relative p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
          </button>

          <button
            type="button"
            onClick={() => handleBaseDomainNavigate("/profile")}
            className="h-7 w-7 rounded-full bg-linear-to-tr from-amber-500 to-amber-200 p-[1px] cursor-pointer overflow-hidden shrink-0"
            title={user?.full_name || user?.username || "Profile"}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name || user.username}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-[#09090b] flex items-center justify-center text-[10px] font-bold text-amber-500">
                {fallbackInitial}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}