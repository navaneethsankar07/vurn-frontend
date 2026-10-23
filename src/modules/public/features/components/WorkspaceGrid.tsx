import {
  Terminal,
  CheckSquare,
  Layers,
  GitBranch,
  BookOpen,
  Cpu,
} from "lucide-react";

const WORKSPACE_FEATURES = [
  {
    icon: Terminal,
    title: "Project Management",
    items: ["Workspaces", "Milestones", "Project analytics", "Team velocity"],
  },
  {
    icon: CheckSquare,
    title: "Issue Tracking",
    items: [
      "Custom statuses",
      "Priorities",
      "Labels",
      "Assignees",
      "Subtasks",
      "Comments",
    ],
  },
  {
    icon: Layers,
    title: "Sprint Planning",
    items: [
      "Backlog grooming",
      "Kanban boards",
      "Story point estimation",
      "Velocity tracking",
    ],
  },
  {
    icon: GitBranch,
    title: "Version Control",
    items: [
      "GitHub integration",
      "Commit syncing",
      "PR linking",
      "Branch tracking",
    ],
  },
  {
    icon: BookOpen,
    title: "Documentation",
    items: [
      "Markdown knowledge base",
      "Team wikis",
      "API references",
      "Rich formatting",
    ],
  },
  {
    icon: Cpu,
    title: "Workflow Engine",
    items: ["Custom automations", "Webhook triggers", "Project templates"],
  },
];

export function WorkspaceGrid() {
  return (
    <section className="px-6 py-16 max-w-8xl mx-35 font-mono border-t border-white/5">
      <div className="space-y-3 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          One workspace for the whole team
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKSPACE_FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-5 hover:border-primary/40 transition-colors group"
            >
              <div className="h-10 w-10 rounded-xs border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-sans tracking-wide">
                  {feat.title}
                </h3>
                <ul className="space-y-2">
                  {feat.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-zinc-400 font-sans flex items-center gap-2"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
