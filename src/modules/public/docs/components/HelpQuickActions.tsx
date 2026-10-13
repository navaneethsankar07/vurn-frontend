import {
  Lightbulb,
  FolderKanban,
  Sparkles,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useHelpTopics } from "../api/docsQueries";
import type { HelpTopicSummary } from "../types";
import { GithubIcon } from "@/utils/icons";

interface HelpQuickActionsProps {
  onSelectTopic: (slug: string) => void;
}

export function HelpQuickActions({ onSelectTopic }: HelpQuickActionsProps) {
  const { data, isLoading } = useHelpTopics();
  const topics = data?.results || [];

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "lightbulb":
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case "folder-kanban":
        return <FolderKanban className="h-4 w-4 text-amber-500" />;
      case "github":
        return <GithubIcon className="h-4 w-4 text-amber-500" />;
      case "sparkles":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading quick actions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {topics.map((topic: HelpTopicSummary) => (
          <div
            key={topic.slug}
            onClick={() => onSelectTopic(topic.slug)}
            className="p-3.5 bg-[#09090B] border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer rounded-xs group flex flex-col justify-between space-y-3"
          >
            <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              {getIcon(topic.icon)}
            </div>
            <div className="space-y-1">
              <span className="font-bold text-zinc-200 group-hover:text-white text-xs block font-sans">
                {topic.title}
              </span>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">
                {topic.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
