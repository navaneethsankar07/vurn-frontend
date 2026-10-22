import { useState, useRef, useEffect } from "react";
import { Users, FolderGit2, MoreHorizontal, Pin, PinOff } from "lucide-react";
import { OrganizationAvatar } from "./OrganizationAvatar";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { usePinOrganizationMutation } from "../api/organizationMutations";
import { toast } from "sonner";
import type { Organization } from "../types";

interface OrganizationListItemProps {
  organization: Organization;
}

export function OrganizationListItem({
  organization,
}: OrganizationListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pinMutation = usePinOrganizationMutation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRedirect = () => {
    window.location.href = getOrganizationUrl(organization.slug);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const newPinnedState = !organization.is_pinned;
    pinMutation.mutate(
      { slug: organization.slug, isPinned: newPinnedState },
      {
        onSuccess: () => {
          toast.success(
            newPinnedState
              ? `Pinned ${organization.name}`
              : `Unpinned ${organization.name}`,
          );
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.error || "Failed to update pin status.";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <div
      onClick={handleRedirect}
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xs border transition-all cursor-pointer font-mono ${
        organization.is_pinned
          ? "border-primary/40 bg-[#0c0c0e] hover:border-primary/60"
          : "border-white/5 bg-[#09090b] hover:bg-[#121215] hover:border-white/15"
      }`}
    >
      <div className="flex items-start gap-4 min-w-0">
        <OrganizationAvatar
          name={organization.name}
          icon={organization.icon}
          accentColor={organization.accent_color}
          logoUrl={organization.logo_url}
        />
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors truncate">
              {organization.name}
            </h3>
            <span className="text-xs text-gray-500 font-normal">
              {organization.slug}
            </span>
            <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-[3px] text-text-primary/70 border border-text-primary/50">
              {organization.role}
            </span>
            {organization.is_pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px]  text-primary/70 border border-primary/30">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
          </div>
          {organization.description ? (
            <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
              {organization.description}
            </p>
          ) : (
            <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
              No description provided.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-gray-400 shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Members">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-gray-300">{organization.member_count}</span>
            <span className="hidden sm:inline text-gray-500">members</span>
          </div>

          <div className="flex items-center gap-1.5" title="Projects">
            <FolderGit2 className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-gray-300">{organization.project_count}</span>
            <span className="hidden sm:inline text-gray-500">projects</span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-[3px] text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-[#0c0c0e] border border-white/10 rounded-xs shadow-xl z-50 py-1 text-xs font-mono">
              <button
                type="button"
                onClick={handleTogglePin}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                {organization.is_pinned ? (
                  <>
                    <PinOff className="h-3.5 w-3.5 text-amber-500" /> Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-3.5 w-3.5 text-amber-500" /> Pin
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
