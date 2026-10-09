import {
  Zap,
  Folder,
  AlertCircle,
  Kanban,
  GitBranch,
  Sparkles,
  Building2,
} from "lucide-react";
import { DOCS_TOPIC_CARDS } from "../docsData";

const iconMap: Record<string, any> = {
  Zap,
  Folder,
  AlertCircle,
  Kanban,
  GitBranch,
  Sparkles,
  Building2,
};

export function DocsTopicsGrid() {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
        <Zap className="h-4 w-4" />
        <span>Browse by topic</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCS_TOPIC_CARDS.map((card, idx) => {
          const IconComponent = iconMap[card.iconName] || Zap;
          return (
            <div
              key={idx}
              className="border border-white/10 rounded-xs bg-[#0C0C0E] p-5 space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-amber-500">
                <IconComponent className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {card.title}
                </h3>
              </div>
              <ul className="space-y-2 border-t border-white/5 pt-3">
                {card.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-400 hover:text-white font-sans transition-colors block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
