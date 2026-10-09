import { Terminal, Kanban, Sparkles, GitBranch } from "lucide-react";

const FEATURES = [
  {
    icon: Terminal,
    title: "Issue Tracking",
    description:
      "Create, organize, and track stories, tasks, bugs, and subtasks with priorities, labels, assignments, and AI-powered duplicate issue detection.",
  },
  {
    icon: Kanban,
    title: "Sprint Planning",
    description:
      "Plan sprints, prioritize your backlog, estimate story points, and track progress with real-time Kanban boards and customizable workflows.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Accelerate planning with AI-powered task breakdown, story point estimation, sprint summaries, release notes, and duplicate issue detection.",
  },
  {
    icon: GitBranch,
    title: "Version Control Integration",
    description:
      "Native GitHub integration. Link repositories, commits, and pull requests directly to project issues for complete development traceability.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto w-full font-mono border-t border-white/5">
      <div className="space-y-4 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Built for modern engineering teams
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          Everything you need to ship high-quality code at velocity, without the
          management overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-4 hover:border-amber-500/40 transition-colors group"
            >
              <div className="h-10 w-10 rounded-xs bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
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
