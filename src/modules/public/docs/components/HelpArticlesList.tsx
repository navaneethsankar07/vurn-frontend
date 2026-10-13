import { Loader2, ArrowRight } from "lucide-react";
import { useHelpArticles } from "../api/docsQueries";
import type { HelpArticleSummary } from "../types";

interface HelpArticlesListProps {
  searchQuery?: string;
  onSelectArticle: (slug: string) => void;
}

export function HelpArticlesList({
  searchQuery,
  onSelectArticle,
}: HelpArticlesListProps) {
  const { data, isLoading } = useHelpArticles(searchQuery);
  const articles = data?.results || [];

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading articles...</span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-500 italic text-xs font-mono">
        No help articles found.
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Popular Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {articles.map((article: HelpArticleSummary) => (
          <div
            key={article.slug}
            onClick={() => onSelectArticle(article.slug)}
            className="p-3.5 bg-[#09090B] border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer rounded-xs group flex items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <span className="font-bold text-zinc-200 group-hover:text-white text-xs block font-sans truncate">
                {article.title}
              </span>
              <span className="text-[10px] text-[#5C5C5C] font-bold uppercase tracking-wider block">
                {article.category}
              </span>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-1">
                {article.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
