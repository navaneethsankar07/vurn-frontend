import { ArrowRight, Clock } from "lucide-react";
import { formatRelativeTime } from "@/utils/date";
import { getOrganizationUrl } from "@/utils/subdomain";
import type { DashboardIssue } from "../types";

interface ContinueWorkingSectionProps {
  issues: DashboardIssue[];
}

export function ContinueWorkingSection({
  issues,
}: ContinueWorkingSectionProps) {

  if (!issues || issues.length === 0) return null;

  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Continue Working
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {issues.slice(0, 3).map((issue) => (
          <div
            key={issue.id}
            className="rounded border border-white/10 bg-[#09090b] p-4 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  {issue.key}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary uppercase font-semibold">
                  {issue.status}
                </span>
              </div>
              <h4 className="text-xs font-medium text-zinc-300 font-sans line-clamp-2">
                {issue.title}
              </h4>
              <p className="text-[10px] text-zinc-500 truncate">
                {issue.organization_name} / {issue.project_name}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />{" "}
                {formatRelativeTime(issue.updated_at)}
              </span>
              <button
                type="button"
                onClick={() => {
                  const targetUrl = getOrganizationUrl(
                    issue.organization_slug,
                    `/projects/${issue.project_slug}/issues`,
                  );

                  window.location.href = targetUrl;
                }}
                className="text-xs text-primary group-hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                Continue <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
