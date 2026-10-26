import type { AiFeatureUsage } from "../../types";

interface BillingUsageInfoProps {
  features: AiFeatureUsage[];
}

export function BillingUsageInfo({ features }: BillingUsageInfoProps) {
  return (
    <div className="rounded border border-white/10 bg-[#09090b] shadow-xl overflow-hidden">
      <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          AI Features & Credit Rates
        </h2>
        <p className="text-zinc-400 text-[11px] font-sans">
          Standard token consumption per operation across available workspace
          intelligence features.
        </p>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {features.map((feature) => (
          <div
            key={feature.key}
            className="group flex items-center justify-between rounded border border-white/10 bg-white/2 hover:bg-white/4 px-3.5 py-3 transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate pr-2">
              <span className="text-zinc-200 font-sans text-xs font-medium truncate">
                {feature.name}
              </span>
            </div>
            <div className="shrink-0">
              <span className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                {feature.credit_cost} credits per use
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
