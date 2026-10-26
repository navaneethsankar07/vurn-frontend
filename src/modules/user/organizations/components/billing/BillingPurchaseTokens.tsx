import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useAiCreditPlans } from "../../api/organizationQueries";
import {
  useCreateRazorpayOrder,
  useVerifyCreditPurchase,
} from "../../api/organizationMutations";

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BillingPurchaseTokens({
  canManageBilling,
}: BillingPurchaseTokensProps) {
  const subdomain = getSubdomain() || "";
  const { data, isLoading } = useAiCreditPlans();
  const plans = data?.plans || [];

  const [purchasingPlanKey, setPurchasingPlanKey] = useState<string | null>(
    null,
  );

  const { mutateAsync: createOrder } = useCreateRazorpayOrder();
  const { mutate: verifyPayment } = useVerifyCreditPurchase();

  const handlePurchase = async (planKey: string) => {
    if (!subdomain) return;
    setPurchasingPlanKey(planKey);

    try {
      const orderData = await createOrder({
        organization_slug: subdomain,
        plan_key: planKey,
      });

      const razorpayOrderId =
        orderData.order_id || (orderData as any).razorpay_order_id;

      const options = {
        key: orderData.razorpay_key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vurn AI",
        description: `Purchase ${orderData.plan?.name || planKey} Token Pack`,
        order_id: razorpayOrderId,
        handler: function (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature: string;
        }) {
          verifyPayment({
            organization_slug: subdomain,
            razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setPurchasingPlanKey(null);
        },
        modal: {
          ondismiss: function () {
            setPurchasingPlanKey(null);
          },
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setPurchasingPlanKey(null);
    }
  };

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

              const isPurchasing = purchasingPlanKey === plan.key;

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
                    disabled={!canManageBilling || isPurchasing}
                    onClick={() => handlePurchase(plan.key)}
                    className={`w-full rounded py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 ${
                      meta.recommended
                        ? "bg-primary text-black hover:bg-primary/90 font-semibold"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {isPurchasing && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {isPurchasing ? "Opening Checkout..." : "Purchase"}
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
