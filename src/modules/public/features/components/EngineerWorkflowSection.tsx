import { Check } from "lucide-react";

export function EngineerWorkflowSection() {
  return (
    <section className="px-6 py-16 max-w-8xl mx-35 font-mono border-t border-white/5">
      <div className="space-y-3 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Built for how engineers actually work
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-white/10 bg-[#0C0C0E] p-6 sm:p-8 rounded-xs space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide">
            Technical Project Management
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Keyboard-first navigation and shortcuts</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Real-time collaborative planning sessions</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Detailed audit logs and activity tracking</span>
            </li>
          </ul>
        </div>

        <div className="border border-white/10 bg-[#0C0C0E] p-6 sm:p-8 rounded-xs space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide">
            More
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Lightning-fast sprint board performance</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Granular role-based access control</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Automated webhook integrations</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Zero-latency enterprise updates</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
