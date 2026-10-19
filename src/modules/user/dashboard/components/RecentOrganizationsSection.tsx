import { ArrowUpRight } from "lucide-react";
import type { DashboardOrganization } from "../types";
import { getOrganizationUrl } from "@/utils/organizationUrl";

interface RecentOrganizationsSectionProps {
  organizations: DashboardOrganization[];
}

export function RecentOrganizationsSection({
  organizations,
}: RecentOrganizationsSectionProps) {

  if (!organizations || organizations.length === 0) return null;

  const formatDate = (eventType: string, dateString: string) => {
    const label = eventType === "created" ? "Created" : "Joined";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 86400) return `${label} today`;
      if (seconds < 172800) return `${label} yesterday`;
      return `${label} ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    } catch {
      return label;
    }
  };

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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-white truncate max-w-30">
                    {org.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400 font-mono truncate max-w-25">
                  {org.slug}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Workspace workspace for team collaboration and code deployment.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-500">
                {formatDate(org.event_type, org.event_date)}
              </span>
              <button
                type="button"
                onClick={() => {
                    const target = getOrganizationUrl(org.slug,"")                    
                    window.location.href = target
                }}
                className="text-xs text-primary group-hover:underline flex items-center gap-1 cursor-pointer font-semibold"
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
