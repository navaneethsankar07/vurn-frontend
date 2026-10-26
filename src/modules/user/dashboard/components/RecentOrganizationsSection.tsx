import { ArrowUpRight } from "lucide-react";
import type { DashboardOrganization } from "../types";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import { renderOrgIcon } from "@/utils/renderOrgIcon";

interface RecentOrganizationsSectionProps {
  organizations: DashboardOrganization[];
}

export function RecentOrganizationsSection({
  organizations,
}: RecentOrganizationsSectionProps) {
  if (!organizations || organizations.length === 0) return null;

  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Recent Organizations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="rounded border border-white/10 bg-[#09090b] p-4 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 w-7 flex items-center justify-center font-bold text-xs"
                    style={{ color: org.accent_color || "inherit" }}
                  >
                    {renderOrgIcon(org.icon)}
                  </div>
                  <span className="text-xs font-semibold text-white truncate max-w-30">
                    {org.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-xs border border-white/10 text-zinc-400 font-mono truncate max-w-25">
                  {org.slug}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-500">
                {formatRelativeTime(org.event_date, org.event_type)}
              </span>
              <button
                type="button"
                onClick={() => {
                  const target = getOrganizationUrl(org.slug, "");
                  window.location.href = target;
                }}
                className="text-xs text-gray-500 group-hover:underline hover:text-gray-400 flex items-center gap-1 cursor-pointer font-semibold"
              >
                Open Workspace <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
