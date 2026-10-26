import { Check } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited organizations",
  "Unlimited members",
  "Unlimited projects",
  "Issue tracking, ticketing",
  "Search",
  "Sprint planning",
  "Kanban boards",
  "Documentation",
  "Version control",
  "Notifications",
];

export function PricingFreeTier() {
  return (
    <section className="px-6 py-12 max-w-8xl mx-35 font-mono">
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Everything you need, forever free
        </h2>
      </div>

      <div className="border border-white/10 rounded-xs bg-[#0C0C0E] p-8 md:p-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Instant Access
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              No credit card required. Get started in seconds.
            </p>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-sans">
            $0
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 pt-8">
          {FREE_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-sans"
            >
              <Check className="h-4 w-4 text-primary shrink-0 stroke-3" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-500 font-mono mt-8 pt-4 border-t border-white/5">
          *Access all core engineering features without time limits or trial
          expiration.
        </p>
      </div>
    </section>
  );
}
