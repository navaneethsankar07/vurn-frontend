import { ChevronRight } from "lucide-react";
import { POPULAR_ARTICLES } from "../docsData";

export function PopularArticles() {
  return (
    <div className="space-y-4 font-mono">
      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
        Popular articles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {POPULAR_ARTICLES.map((article, idx) => (
          <a
            key={idx}
            href={article.href}
            className="border border-white/10 rounded-xs bg-[#0C0C0E] p-4 flex items-center justify-between hover:border-amber-500/40 transition-colors group"
          >
            <span className="text-xs text-zinc-300 font-sans font-medium group-hover:text-white">
              {article.title}
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-amber-500 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
