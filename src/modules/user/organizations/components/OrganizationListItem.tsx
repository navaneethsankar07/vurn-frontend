import { Users, FolderGit2, MoreHorizontal } from "lucide-react";
import { OrganizationAvatar } from "./OrganizationAvatar";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import type { Organization } from "../types";

interface OrganizationListItemProps {
  organization: Organization;
}

export function OrganizationListItem({
  organization,
}: OrganizationListItemProps) {
  const handleRedirect = () => {
    window.location.href = getOrganizationUrl(organization.slug);
  };

  return (
    <div
      onClick={handleRedirect}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[3px] border border-white/5 bg-[#09090b] hover:bg-[#121215] hover:border-white/15 transition-all cursor-pointer font-mono"
    >
      <div className="flex items-start gap-3.5 min-w-0">
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
            <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-[3px]  text-primary/80 border border-primary/80">
              {organization.role}
            </span>
          </div>
          {organization.description ? (
            <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
              {organization.description}
            </p>
          ):(
            <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
              No description provided.
            </p>
          ) }
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

        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-[3px] text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
