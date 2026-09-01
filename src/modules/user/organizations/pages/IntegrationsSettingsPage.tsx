import { GitBranch, GitCommit, GitFork, ShieldAlert } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationAccess } from "../api/organizationQueries";

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    description: "Source control and merge request workflows.",
    icon: GitFork,
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Source control and merge request workflows.",
    icon: GitBranch,
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Source control and pull request workflows.",
    icon: GitCommit,
  },
];

export function IntegrationsSettingsPage() {
  const subdomain = getSubdomain() || "";
  const { data: accessData } = useOrganizationAccess(subdomain);
  const isOwner = accessData?.role === "owner";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-15rem)] max-w-3xl flex-col justify-between font-mono text-xs px-4 sm:px-6 py-4 select-none">
      <div className="space-y-4">
        <div className="text-gray-400 text-xs">Integrations</div>

        {!isOwner && (
          <div className="flex items-center gap-2.5 p-3.5 rounded border border-primary/70 text-primary  text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>
              Only the organization owner can manage integrations settings. You
              have view-only access.
            </span>
          </div>
        )}

        <div className="rounded border border-white/10 bg-[#09090b] shadow-2xl">
          <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
            <h2 className="text-sm font-semibold text-white">Integrations</h2>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Connect Vurn to the services your engineering team already uses.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {INTEGRATIONS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${
                    index !== INTEGRATIONS.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-gray-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-white font-medium text-xs sm:text-sm">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-[11px]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center shrink-0 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-gray-400">
                    Coming Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-4">
          <span className="text-gray-500 text-[11px]">All changes saved.</span>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-3.5 py-2 text-gray-400 hover:text-white transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled
              className="w-full sm:w-auto bg-secondary border-primary border-2 hover:text-primary/70 hover:border-primary/70 disabled:opacity-50 text-primary px-4 py-2 rounded-xs text-xs font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
