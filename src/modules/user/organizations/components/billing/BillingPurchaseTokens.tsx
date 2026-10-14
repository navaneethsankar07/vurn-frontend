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

interface BillingPurchaseTokensProps {
  canManageBilling: boolean;
}

export function BillingPurchaseTokens({
  canManageBilling,
}: BillingPurchaseTokensProps) {
  return (
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
  );
}
