export const AI_FEATURE_CREDIT_COSTS = {
  task_breakdown: 5,
  story_point_estimation: 2,
  duplicate_issue_detection: 5,
  sprint_summary: 10,
  release_notes: 10,
};

const FEATURE_LABELS: Record<string, string> = {
  task_breakdown: "AI Task Breakdown",
  story_point_estimation: "AI Story Point Estimation",
  duplicate_issue_detection: "AI Duplicate Issue Detection",
  sprint_summary: "AI Sprint Summary",
  release_notes: "AI Release Notes",
};

export function PricingAiCredits() {
  return (
    <section className="px-6 py-12 max-w-8xl mx-35 font-mono">
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Start with 100 free credits
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 border border-primary/30 rounded-xs bg-[#0C0C0E] p-8 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              100 Free AI Credits
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Every newly created organization receives free credits upon
              creation.
            </p>
          </div>
          <ul className="space-y-3 pt-2 text-xs text-zinc-300 font-sans relative z-10 border-t border-white/5">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>AI Credits are shared per organization workspace.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Only AI features consume credits.</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 border border-white/10 rounded-xs bg-[#0C0C0E] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
            <span>Feature</span>
            <span>Credit Cost</span>
          </div>
          <div className="divide-y divide-white/5">
            {Object.entries(AI_FEATURE_CREDIT_COSTS).map(([key, cost]) => (
              <div
                key={key}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/3 transition-colors"
              >
                <span className="text-xs sm:text-sm text-white font-sans font-medium">
                  {FEATURE_LABELS[key] || key}
                </span>
                <span className="text-xs font-bold text-text-primary px-2.5 py-1 rounded-xs">
                  {cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
