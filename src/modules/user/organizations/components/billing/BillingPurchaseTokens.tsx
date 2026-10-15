import { Loader2 } from "lucide-react";
import { useAiCreditPlans } from "../../api/organizationQueries";

interface BillingPurchaseTokensProps {
  canManageBilling: boolean;
}

const PLAN_METADATA: Record<
  string,
  { description: string; recommended: boolean; originalPrice: number }
> = {
  starter: {
    description: "For focused team workflows",
    recommended: false,
    originalPrice: 199,
  },
  professional: {
    description: "For growing engineering teams",
    recommended: true,
    originalPrice: 799,
  },
  enterprise: {
    description: "For organization-wide AI work",
    recommended: false,
    originalPrice: 2999,
  },
};

export function BillingPurchaseTokens({
  canManageBilling,
}: BillingPurchaseTokensProps) {
  const { data, isLoading } = useAiCreditPlans();
  const plans = data?.plans || [];
  

  return (
    <div className="rounded border border-white/10 bg-[#09090b] shadow-xl font-mono">
      <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
        <h2 className="text-sm font-semibold text-white">Purchase Tokens</h2>
        <p className="text-gray-400 text-[11px]">
          One-time packs. Tokens never expire.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-zinc-500 gap-2 text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading credit plans...</span>
          </div>
        ) : plans.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs italic">
            No credit plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const meta = PLAN_METADATA[plan.key] || {
                description: "AI Token Pack",
                recommended: false,
                originalPrice: plan.price_inr + 100,
              };

              return (
                <div
                  key={plan.key}
                  className={`flex flex-col justify-between rounded border p-4 space-y-4 transition-colors ${
                    meta.recommended
                      ? "border-primary/50 bg-primary/5"
                      : "border-white/10 bg-white/2"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {plan.name}
                      </span>
                      {meta.recommended && (
                        <span className="text-[10px] text-primary font-medium">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-lg font-bold text-white tracking-tight select-text">
                        {plan.credits.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-[10px]">AI Tokens</div>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-white">
                        ₹{plan.price_inr}
                      </span>
                      <span className="text-xs text-zinc-500 line-through">
                        ₹{meta.originalPrice}
                      </span>
                    </div>

                    <p className="text-gray-400 text-[11px] min-h-8 font-sans">
                      {meta.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!canManageBilling}
                    className={`w-full rounded py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      meta.recommended
                        ? "bg-primary text-black hover:bg-primary/90 font-semibold"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Purchase
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
