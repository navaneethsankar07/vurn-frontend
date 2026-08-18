import { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { getSubdomain } from "@/utils/subdomain";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import logo from "@/assets/logo.svg";

interface OrganizationSummary {
  name: string;
  slug: string;
  icon?: string | null;
  logo_url?: string | null;
}

interface OrganizationNavbarProps {
  currentOrgName?: string;
}

export function OrganizationNavbar({
  currentOrgName,
}: OrganizationNavbarProps) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

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

  const fallbackInitial = user?.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user?.username
      ? user.username.charAt(0).toUpperCase()
      : "U";

  const userOrgs = (user?.organizations as OrganizationSummary[]) || [];

  const extractedSubdomain = currentSubdomain?.split(".")[0]?.toLowerCase();

  const activeOrg = userOrgs.find(
    (org) => org.slug.toLowerCase() === extractedSubdomain,
  );

  const activeOrgName =
    activeOrg?.name ||
    currentOrgName ||
    (currentSubdomain ? currentSubdomain : "Workspace");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030303] font-mono">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-18">
          <button
            type="button"
            onClick={() => handleBaseDomainNavigate("/dashboard")}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="flex items-center justify-center">
              <object
                data={logo}
                type="image/svg+xml"
                className="w-2 sm:w-32 pointer-events-none"
              />
            </span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOrgDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between gap-3 bg-[#09090b] px-3.5 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10 min-w-48 sm:min-w-56"
            >
              <div className="flex items-center gap-2.5">
                {activeOrg?.logo_url ? (
                  <img
                    src={activeOrg.logo_url}
                    alt={activeOrgName}
                    className="h-5 w-5 object-cover shrink-0"
                  />
                ) : activeOrg?.icon ? (
                  <span className="shrink-0 flex items-center justify-center">
                    {renderOrgIcon(activeOrg.icon, {
                      className: "h-4 w-4 text-amber-500",
                    })}
                  </span>
                ) : (
                  <Building2 className="h-4 w-4 text-amber-500 shrink-0" />
                )}

                <div className="flex flex-col text-left justify-center">
                  <span className="text-[11px] text-gray-500 uppercase leading-none">
                    Organization
                  </span>
                  <span className="font-semibold text-white text-sm leading-tight capitalize pt-0.5">
                    {activeOrgName}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-1" />
            </button>

            {orgDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#09090b] py-1.5 shadow-xl z-50 text-sm border border-white/10">
                <div className="px-3.5 py-1.5 text-[11px] uppercase text-gray-500 font-semibold">
                  Your Organizations
                </div>

                {userOrgs.length > 0 ? (
                  userOrgs.map((org) => {
                    const isCurrent =
                      currentSubdomain?.toLowerCase() ===
                      org.slug.toLowerCase();
                    return (
                      <button
                        key={org.slug}
                        type="button"
                        onClick={() => handleSwitchOrg(org.slug)}
                        className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer ${
                          isCurrent
                            ? "text-white bg-white/5 font-semibold"
                            : "text-gray-300"
                        }`}
                      >
                        {org.logo_url ? (
                          <img
                            src={org.logo_url}
                            alt={org.name}
                            className="h-4.5 w-4.5 object-cover shrink-0"
                          />
                        ) : org.icon ? (
                          <span className="shrink-0 flex items-center justify-center">
                            {renderOrgIcon(org.icon, {
                              className: `h-4 w-4 ${
                                isCurrent ? "text-amber-500" : "text-gray-500"
                              }`,
                            })}
                          </span>
                        ) : (
                          <Building2
                            className={`h-4 w-4 shrink-0 ${
                              isCurrent ? "text-amber-500" : "text-gray-500"
                            }`}
                          />
                        )}
                        <span className="truncate capitalize text-sm">{org.name}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3.5 py-2 text-gray-500 text-sm">
                    No organizations found
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setOrgDropdownOpen(false);
                    handleBaseDomainNavigate("/organizations");
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-amber-500 hover:bg-white/5 transition-colors border-t border-white/5 cursor-pointer text-sm font-medium"
                >
                  View All Organizations
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-6 sm:mx-10">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search resources, organizations, or members..."
              className="w-full bg-[#09090b] pl-10 pr-14 py-2 text-sm text-white placeholder-gray-500 outline-none border border-white/10 focus:border-white/20 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-400">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="flex items-center gap-2 border border-white/10 bg-[#09090b] px-3.5 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <button
            type="button"
            onClick={() => handleBaseDomainNavigate("/profile")}
            className="h-8.5 w-8.5 rounded-full bg-linear-to-tr from-amber-500 to-amber-200 p-px cursor-pointer overflow-hidden shrink-0"
            title={user?.full_name || user?.username || "Profile"}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name || user.username}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-[#09090b] flex items-center justify-center text-xs font-bold text-amber-500">
                {fallbackInitial}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}