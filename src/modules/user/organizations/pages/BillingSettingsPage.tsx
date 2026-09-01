import Coin3Line from "@/utils/icons";
import { Check, TrendingUp, ShieldAlert } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationAccess } from "../api/organizationQueries";
import { useOrganizationPermission } from "@/hooks/useOrganizationPermission";

const TOKEN_PACKS = [
  {
    id: "starter",
    name: "Starter",
    tokens: "5,000",
    description: "For focused team workflows",
    recommended: false,
  },
  {
    id: "professional",
    name: "Professional",
    tokens: "25,000",
    description: "For growing engineering teams",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tokens: "100,000",
    description: "For organization-wide AI work",
    recommended: false,
  },
];

const USAGE_FEATURES = [
  "AI Sprint Planning",
  "AI Issue Generation",
  "AI Documentation",
  "AI Search",
  "AI Engineering Insights",
];

export function BillingSettingsPage() {
  const subdomain = getSubdomain() || "";
  const { data: accessData } = useOrganizationAccess(subdomain);
  const hasBillingPermission = useOrganizationPermission(
    "organization.billing.manage",
  );

  const canManageBilling =
    accessData?.role === "owner" ||
    accessData?.role === "admin" ||
    hasBillingPermission;

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-mono text-xs px-4 sm:px-6 py-4 select-none">
      <div className="text-gray-400 text-xs">Billing</div>

      {!canManageBilling && (
        <div className="flex items-center gap-2.5 p-3.5 rounded border border-primary/70 text-primary text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            You have view-only access to billing settings. You do not have
            permission to purchase tokens.
          </span>
        </div>
      )}

      <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
        <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
          <h2 className="text-sm font-semibold text-white">AI Token Balance</h2>
          <p className="text-gray-400 text-[11px]">
            Tokens power AI features across your Vurn workspace.
          </p>
        </div>

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Coin3Line size="30" />

            <div className="space-y-0.5">
              <div className="text-lg font-bold text-white tracking-tight select-text">
                12,480{" "}
                <span className="text-xs font-normal text-gray-400">
                  AI Tokens
                </span>
              </div>
              <p className="text-gray-400 text-[11px]">
                Approximately 3 weeks remaining based on recent usage.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
        <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
          <h2 className="text-sm font-semibold text-white">Usage Statistics</h2>
          <p className="text-gray-400 text-[11px]">
            Current organization token consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 divide-white/10 p-5 sm:p-6 gap-6 sm:gap-0">
          <div className="sm:pr-6 space-y-1">
            <div className="text-gray-400 text-[11px]">Tokens Used Today</div>
            <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              482
            </div>
          </div>

          <div className="sm:px-6 pt-4 sm:pt-0 space-y-1">
            <div className="text-gray-400 text-[11px]">
              Tokens Used This Month
            </div>
            <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              8,320
            </div>
          </div>

          <div className="sm:pl-6 pt-4 sm:pt-0 space-y-1">
            <div className="text-gray-400 text-[11px]">Average Daily Usage</div>
            <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              396
            </div>
          </div>
        </div>
      </div>

      <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
        <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
          <h2 className="text-sm font-semibold text-white">Purchase Tokens</h2>
          <p className="text-gray-400 text-[11px]">
            One-time packs. Tokens never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 sm:p-6">
          {TOKEN_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`flex flex-col justify-between rounded border p-4 space-y-4 transition-colors ${
                pack.recommended
                  ? "border-primary/50 bg-primary/5"
                  : "border-white/10 bg-white/2"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{pack.name}</span>
                  {pack.recommended && (
                    <span className="text-[10px] text-primary font-medium">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-lg font-bold text-white tracking-tight select-text">
                    {pack.tokens}
                  </div>
                  <div className="text-gray-400 text-[10px]">AI Tokens</div>
                </div>

                <p className="text-gray-400 text-[11px] min-h-8">
                  {pack.description}
                </p>
              </div>

              <button
                type="button"
                disabled={!canManageBilling}
                className={`w-full rounded py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  pack.recommended
                    ? "bg-primary text-black hover:bg-primary"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
        <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
          <h2 className="text-sm font-semibold text-white">
            Usage Information
          </h2>
          <p className="text-gray-400 text-[11px]">
            Tokens are consumed only when AI features perform work.
          </p>
        </div>

        <div className="p-5 sm:p-6 flex flex-wrap gap-2.5">
          {USAGE_FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-gray-300 text-[11px]"
            >
              <Check className="h-3.5 w-3.5 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
