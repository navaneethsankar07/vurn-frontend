import { Sparkles, Bot, FileText, ListTree, Zap } from "lucide-react";

const AI_FEATURES = [
  {
    icon: ListTree,
    title: "AI Task Breakdown",
    description:
      "Automatically decompose complex epics into actionable subtasks with estimated scopes.",
  },
  {
    icon: Sparkles,
    title: "AI Story Point Estimation",
    description:
      "Predict story complexity and estimate points based on historical team velocity.",
  },
  {
    icon: Bot,
    title: "AI Duplicate Issue Detection",
    description:
      "Intelligently flag and group duplicate bug reports across your backlog.",
  },
  {
    icon: Zap,
    title: "AI Sprint Summary",
    description:
      "Generate automated retrospective highlights and release notes instantly.",
  },
  {
    icon: FileText,
    title: "AI Release Notes",
    description:
      "Draft customer-facing release notes and changelogs directly from merged pull requests.",
  },
];

export function AiWorkflowSection() {
  return (
    <section className="px-6 py-16 max-w-8xl mx-35 font-mono border-t border-white/5">
      <div className="space-y-3 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          AI that accelerates your workflow
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
          Cut out routine planning overhead with smart assistance built right
          into your engineering backlog.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className={`border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-4 hover:border-primary/40 transition-colors group ${
                idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-xs bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white font-sans tracking-wide">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
