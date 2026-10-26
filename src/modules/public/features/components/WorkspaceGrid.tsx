import {
  Terminal,
  CheckSquare,
  Layers,
  GitBranch,
  BookOpen,
  UsersRound,
} from "lucide-react";

const WORKSPACE_FEATURES = [
  {
    icon: Terminal,
    title: "Organization Management",
    items: [
      "Workspaces / projects",
      "Roles",
      "Permissions",
      "Invite & Manage Members",
    ],
  },
  {
    icon: UsersRound,
    title: "Project Management",
    items: ["Sprints", "Issues", "Members", "Custom Workflow"],
  },
  {
    icon: CheckSquare,
    title: "Issue Tracking",
    items: ["Subtasks", "Comments", "Attachments", "Sprint History"],
  },
  {
    icon: Layers,
    title: "Sprint Planning",
    items: ["Backlog", "Kanban board", "Story point estimation", "Add Issues"],
  },
  {
    icon: GitBranch,
    title: "Version Control",
    items: [
      "Integration",
      "Commit Tracking",
      "PR Tracking",
      "Issue Trancking & Linking",
    ],
  },
  {
    icon: BookOpen,
    title: "Knowlege Base",
    items: ["Folders", "Files", "Markdown Support", "Rich Text Editor"],
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
