import { useState } from "react";
import { Tag, Loader2, Plus, X } from "lucide-react";
import { useDocumentTags } from "../api/knowledgeQueries";
import { useRemoveDocumentTag } from "../api/knowledgeMutations";
import { CreateDocumentTagForm } from "./CreateDocumentTagForm";
import { DocumentTagSuggestions } from "./DocumentTagSuggestions";

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
  const [isAdding, setIsAdding] = useState(false);

  const { data, isLoading } = useDocumentTags(
    subdomain,
    projectSlug,
    documentId,
  );
  const tags = data?.results || [];

  const { mutate: removeTag, isPending: isRemoving } = useRemoveDocumentTag(
    subdomain,
    projectSlug,
    documentId,
  );

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Tags ({tags.length})
          </span>
        </div>

        {documentId && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            title="Add Tag"
            className="p-1 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs space-y-2.5">
        {isAdding && documentId && (
          <>
            <CreateDocumentTagForm
              subdomain={subdomain}
              projectSlug={projectSlug}
              documentId={documentId}
              onClose={() => setIsAdding(false)}
            />
            <DocumentTagSuggestions
              subdomain={subdomain}
              projectSlug={projectSlug}
              documentId={documentId}
            />
          </>
        )}

        {tags.length === 0 && !isAdding ? (
          <p className="text-xs text-zinc-600 italic">No tags attached.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="group relative inline-flex items-center px-2.5 py-1 bg-white/5 border border-white/10 text-zinc-300 text-[11px] rounded-xs font-mono pr-5"
              >
                <span>{tag.name}</span>
                {documentId && (
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => removeTag(tag.id)}
                    title="Remove tag"
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-zinc-800 border border-white/20 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
