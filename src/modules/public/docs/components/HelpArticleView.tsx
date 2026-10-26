import { useHelpArticleDetail } from "../api/docsQueries";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import DOMPurify from "dompurify";

interface HelpArticleViewProps {
  slug: string;
  onBack: () => void;
}

export function HelpArticleView({ slug, onBack }: HelpArticleViewProps) {
  const { data: article, isLoading, isError } = useHelpArticleDetail(slug);

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-zinc-500 font-mono text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading article...</span>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="space-y-4 font-mono">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Help Center
        </button>
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-xs">
          Failed to load article.
        </div>
      </div>
    );
  }

  const sanitizedHTML = DOMPurify.sanitize(article.content);

  return (
    <div className="space-y-6 font-mono text-white max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Help Center
      </button>

      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#5C5C5C] font-bold">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Clock className="h-3 w-3" /> {article.read_time_minutes} min read
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {article.title}
        </h1>
        <p className="text-xs text-zinc-400 font-sans">{article.description}</p>
      </div>

      <div
        className="help-content-wrapper text-zinc-300 font-sans text-md leading-relaxed space-y-4 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-primary [&>h1]:mt-6 [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-zinc-200 [&>h3]:mt-4 [&>h3]:mb-1 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>strong]:text-white [&>a]:text-amber-400 [&>a]:underline"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}
