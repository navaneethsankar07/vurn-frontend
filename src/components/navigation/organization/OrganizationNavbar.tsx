import { useState, useRef, useEffect } from "react";
import { Plus, Bell, ChevronDown, Building2 } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { getSubdomain } from "@/utils/subdomain";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { useModal } from "@/hooks/useModal";
import { UserNotificationMenu } from "@/modules/user/notifications/component/modal/UserNotificationMenu";
import { UserProfileMenu } from "@/modules/user/account/components/UserProfileMenu";
import { OrgCreateNewMenu } from "@/components/modals/OrgCreateNewMenu";
import { useUnreadNotificationCount } from "@/modules/user/notifications/api/notificationQueries";

import logo from "@/assets/logo.svg";
import { GlobalSearchInput } from "@/modules/user/search/components/GlobalSearchInput";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const notificationModal = useModal(false);
  const createNewModal = useModal(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const createNewRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.unread_count ?? 0;

  const currentSubdomain = getSubdomain();
  const navigate = useNavigate();

  const port = window.location.port ? `:${window.location.port}` : "";
  const rawBaseDomain = import.meta.env.VITE_APP_BASE_DOMAIN || "lvh.me";
  const cleanBaseDomain = rawBaseDomain.split(":")[0];
  const baseHost = `${cleanBaseDomain}${port}`;
  const protocol = window.location.protocol;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        notificationModal.closeModal();
      }
      if (
        createNewRef.current &&
        !createNewRef.current.contains(event.target as Node)
      ) {
        createNewModal.closeModal();
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationModal, createNewModal]);

  useKeyboardShortcuts({
    onNew: () => {
      createNewModal.toggleModal();
    },
    onNotifications: () => {
      notificationModal.toggleModal();
    },
    onEscape: () => {
      createNewModal.closeModal();
      notificationModal.closeModal();
      setIsProfileMenuOpen(false);
      setOrgDropdownOpen(false);
    },
    onGoToProjects: () => {
      navigate("/projects");
    },
    onGoToOrganizations: () => {
      handleBaseDomainNavigate("/organizations");
    },
    onGoToHome: () => {
      handleBaseDomainNavigate("/dashboard");
    },
    onGoToDocs: () => {
      if (window.location.pathname.includes("/projects/")) {
        return;
      }
      toast.error("Go to Docs shortcut only works inside a project workspace.");
    },
    onCreateIssue: () => {
      if (window.location.pathname.includes("/projects/")) {
        return;
      }
      toast.error(
        "Create Issue shortcut only works inside a project workspace.",
      );
    },
    onRefreshRepository: () => {
      if (
        window.location.pathname.includes("/repository") ||
        window.location.pathname.includes("/projects/")
      ) {
        return;
      }
      toast.error(
        "Refresh Repository (R) shortcut only works on the repository page inside a project.",
      );
    },
  });

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
            className="flex gap-2 shrink-0 cursor-pointer h-16 overflow-hidden items-center justify-center"
          >
            <span className="flex items-center justify-center overflow-hidden h-full">
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
                        <span className="truncate capitalize text-sm">
                          {org.name}
                        </span>
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
          <GlobalSearchInput />
        </div>

        <div className="flex items-center gap-3.5">
          <div
            className="relative"
            ref={createNewRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={createNewModal.toggleModal}
              aria-expanded={createNewModal.isOpen}
              className="flex items-center gap-2 border border-white/10 bg-[#09090b] px-3.5 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {createNewModal.isOpen && (
              <div className="absolute -right-17 top-full z-50 mt-3.5">
                <OrgCreateNewMenu onClose={createNewModal.closeModal} />
              </div>
            )}
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={notificationModal.toggleModal}
              aria-label="Notifications"
              aria-expanded={notificationModal.isOpen}
              className="relative p-2 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>

            {notificationModal.isOpen && (
              <div className="absolute -right-5 top-full z-50 mt-4">
                <UserNotificationMenu onClose={notificationModal.closeModal} />
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-label="Account menu"
              aria-expanded={isProfileMenuOpen}
              className="h-8.5 w-8.5 rounded-full bg-linear-to-tr from-amber-500 to-amber-200 p-px cursor-pointer overflow-hidden shrink-0 block"
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

            {isProfileMenuOpen && (
              <div className="absolute -right-4 top-full z-50 mt-4">
                <UserProfileMenu onClose={() => setIsProfileMenuOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
