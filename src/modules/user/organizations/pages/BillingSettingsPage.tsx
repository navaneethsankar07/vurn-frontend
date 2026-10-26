import { ShieldAlert, Loader2 } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationAccess } from "../api/organizationQueries";
import { useOrganizationPermission } from "@/hooks/useOrganizationPermission";
import { useAiUsageStatistics } from "../api/organizationQueries";
import { BillingTokenBalance } from "../components/billing/BillingTokenBalance";
import { BillingUsageStats } from "../components/billing/BillingUsageStats";
import { BillingPurchaseTokens } from "../components/billing/BillingPurchaseTokens";
import { BillingUsageInfo } from "../components/billing/BillingUsageInfo";
import { BillingUsageHistory } from "../components/billing/BillingUsageHistory";
import { BillingPurchaseHistory } from "../components/billing/BillingPurchaseHistory";

export function BillingSettingsPage() {
  const subdomain = getSubdomain() || "";
  const { data: accessData } = useOrganizationAccess(subdomain);
  const hasBillingPermission = useOrganizationPermission(
    "organization.billing.manage",
  );

  const { data: usageData, isLoading: isLoadingUsage } =
    useAiUsageStatistics(subdomain);

  const canManageBilling =
    accessData?.role === "owner" ||
    accessData?.role === "admin" ||
    hasBillingPermission;

  if (isLoadingUsage) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-zinc-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading billing and usage statistics...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-mono text-xs px-4 sm:px-6 py-4 select-none">
      {!canManageBilling && (
        <div className="flex items-center gap-2.5 p-3.5 rounded border border-primary/70 text-primary text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            You have view-only access to billing settings. You do not have
            permission to purchase tokens.
          </span>
        </div>
      )}

      <BillingTokenBalance
        remainingCredits={usageData?.remaining_ai_credits ?? 0}
      />

      <BillingUsageStats
        creditsUsedToday={usageData?.credits_used_today ?? 0}
        creditsUsedThisMonth={usageData?.credits_used_this_month ?? 0}
        averageDailyUsage={usageData?.average_daily_usage ?? "0"}
      />

      <BillingPurchaseTokens canManageBilling={canManageBilling} />

      <BillingUsageInfo features={usageData?.available_features ?? []} />

      <BillingPurchaseHistory organizationSlug={subdomain} />

      <BillingUsageHistory organizationSlug={subdomain} />
    </div>
  );
}
