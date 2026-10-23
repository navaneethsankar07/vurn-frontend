import { Check, X } from "lucide-react";

const VURN_FEATURES = [
  "Commit Tracking",
  "Pull Request Tracking",
  "Issue Tracking",
  "Automatic & Manual Issue Linking",
  "Release Notes",
];

const STANDARD_FEATURES = [
  "Manual status updates",
  "Disconnected workflow",
  "Context switching",
  "Extra overhead",
  "Slower velocity",
];

export function GitHubIntegrationSection() {
  return (
    <section className="px-6 py-16 max-w-8xl mx-35 font-mono border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Your project management layer for integrations
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Connect your codebase directly to your tracking workspace. Eliminate
            manual status updates and keep development completely synchronized.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-3 bg-[#0C0C0E] border border-white/10 p-5 rounded-xs">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                Vurn
              </h4>
              <ul className="space-y-2.5">
                {VURN_FEATURES.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-zinc-300 font-sans"
                  >
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 bg-[#0C0C0E] border border-white/5 p-5 rounded-xs opacity-70">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                Standard Tools
              </h4>
              <ul className="space-y-2.5">
                {STANDARD_FEATURES.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-zinc-500 font-sans"
                  >
                    <X className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-4 font-mono text-xs">
            <div className="text-[11px] text-zinc-500 uppercase font-bold border-b border-white/10 pb-3">
              Repository Activity Stream
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xs bg-white/3 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">
                  Commit: fix authentication redirect flow
                </span>
                <span className="text-primary font-bold">#VR-142</span>
              </div>
              <div className="p-3 rounded-xs bg-white/3 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">
                  Pull Request: add webhook event queue
                </span>
                <span className="text-primaryfont-bold">#VR-189</span>
              </div>
              <div className="p-3 rounded-xs bg-white/3 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-300">
                  Issue: fix authentication redirect flow
                </span>
                <span className="text-primary font-bold">#VR-204</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
