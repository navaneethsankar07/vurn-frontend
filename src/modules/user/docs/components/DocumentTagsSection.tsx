import { Tag, Loader2 } from "lucide-react";
import { useDocumentTags } from "../api/knowledgeQueries";

interface DocumentTagsSectionProps {
  subdomain: string;
  projectSlug: string;
  documentId: number | null;
}

export function DocumentTagsSection({
  subdomain,
  projectSlug,
  documentId,
}: DocumentTagsSectionProps) {
  const { data, isLoading } = useDocumentTags(
    subdomain,
    projectSlug,
    documentId,
  );
  const tags = data?.results || [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Tags
        </span>
        <div className="p-3 bg-black/40 border border-white/5 rounded-xs flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Loading tags...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Tags ({tags.length})
        </span>
      </div>

      <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs">
        {tags.length === 0 ? (
          <p className="text-xs text-zinc-600 italic">No tags attached.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-300 text-[11px] rounded-xs font-mono"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
