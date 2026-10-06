import { Sparkles } from "lucide-react";
import { useTagSuggestions } from "../api/knowledgeQueries";
import { useCreateDocumentTag } from "../api/knowledgeMutations";

interface DocumentTagSuggestionsProps {
  subdomain: string;
  projectSlug: string;
  documentId: number;
}

export function DocumentTagSuggestions({
  subdomain,
  projectSlug,
  documentId,
}: DocumentTagSuggestionsProps) {
  const { data, isLoading } = useTagSuggestions(
    subdomain,
    projectSlug,
    documentId,
  );
  const { mutate: createTag, isPending } = useCreateDocumentTag(
    subdomain,
    projectSlug,
    documentId,
  );

  const suggestions = data?.tags || [];

  if (isLoading || suggestions.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1 font-mono">
      <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wide">
        <Sparkles className="h-3 w-3 text-amber-500" />
        <span>Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            disabled={isPending}
            onClick={() => createTag({ name: suggestion.name })}
            className="px-2 py-0.5 bg-black/60 border border-white/10 hover:border-amber-500/50 text-zinc-400 hover:text-white text-[10px] rounded-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            + {suggestion.name}
          </button>
        ))}
      </div>
    </div>
  );
}
