import { useHelpTopicDetail } from "../api/docsQueries";
import { Loader2, ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";

interface HelpTopicViewProps {
  slug: string;
  onBack: () => void;
}

export function HelpTopicView({ slug, onBack }: HelpTopicViewProps) {
  const { data: topic, isLoading, isError } = useHelpTopicDetail(slug);

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-zinc-500 font-mono text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading guide...</span>
      </div>
    );
  }

  if (isError || !topic) {
    return (
      <div className="space-y-4 font-mono">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Help Center
        </button>
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-xs">
          Failed to load help topic.
        </div>
      </div>
    );
  }

  const sanitizedHTML = DOMPurify.sanitize(topic.content);

  return (
    <div className="space-y-4 font-mono text-white max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Help Center
      </button>

      <div className="space-y-2 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {topic.title}
        </h1>
        <p className="text-xs text-zinc-400 font-sans">{topic.description}</p>
      </div>

      <div
        className="help-content-wrapper text-zinc-300 font-sans text-md leading-relaxed space-y-4 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-white [&>h1]:mt-6 [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-zinc-100 [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-zinc-200 [&>h3]:mt-4 [&>h3]:mb-1 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>strong]:text-white [&>a]:text-amber-400 [&>a]:underline"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}
