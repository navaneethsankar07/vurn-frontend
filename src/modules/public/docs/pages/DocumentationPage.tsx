import { useState } from "react";
import { useHelpTopics } from "../api/docsQueries";
import { HelpTopicView } from "../components/HelpTopicView";
import {
  Loader2,
  BookOpen,
  Lightbulb,
  FolderKanban,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { GithubIcon } from "@/utils/icons";

export function DocumentationPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("getting-started");
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
        return <BookOpen className="h-4 w-4 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-black text-white p-8 flex items-center justify-center font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin text-[#5C5C5C] mr-2" />
        Loading documentation...
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white p-4 sm:p-6 lg:p-8 font-mono flex flex-col overflow-hidden">
      <div className="max-w-6xl w-full mx-auto space-y-6 flex flex-col flex-1 min-h-0">
        <div className="shrink-0 space-y-1 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-[#5C5C5C] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" /> Official Documentation
          </div>
          <h1 className="text-lg font-bold tracking-tight uppercase text-white">
            Vurn Engineering Workspace Guides
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Explore comprehensive guides and documentation to master workspace
            management, project collaboration, GitHub integration, and
            AI-powered tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1 min-h-0 overflow-hidden">
          <div className="lg:col-span-1 bg-[#09090B] border border-white/10 p-2 space-y-1 rounded-xs shrink-0">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Topics
            </div>
            {topics.map((topic) => {
              const isSelected = selectedSlug === topic.slug;
              return (
                <button
                  key={topic.slug}
                  onClick={() => setSelectedSlug(topic.slug)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors cursor-pointer rounded-xs ${
                    isSelected
                      ? "bg-white/10 text-white font-bold border-l-2 border-primary"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getIcon(topic.icon)}
                    <span className="truncate font-sans">{topic.title}</span>
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 ${
                      isSelected ? "text-amber-500" : "text-zinc-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 bg-[#09090B] border border-white/10 p-6 sm:p-8 rounded-xs h-full overflow-y-auto">
            <HelpTopicView slug={selectedSlug} showBackButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
