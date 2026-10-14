import { useState } from "react";
import { Copy, Check, FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AiReleaseNotesResponse, ReleaseHighlightItem } from "../types";
import { useDocumentFolders, useProjectDocuments } from "../../docs/api/knowledgeQueries";
import { useCreateDocumentFolder, useCreateProjectDocument } from "../../docs/api/knowledgeMutations";

interface ReleaseNotesResultViewProps {
  subdomain: string;
  projectSlug: string;
  resultData: AiReleaseNotesResponse;
}

export function ReleaseNotesResultView({
  subdomain,
  projectSlug,
  resultData,
}: ReleaseNotesResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [isAddingToKb, setIsAddingToKb] = useState(false);

  const { data: foldersData } = useDocumentFolders(subdomain, projectSlug);
  const folders = foldersData?.results || [];

  const matchedFolder = folders.find(
    (f) => f.name.trim().toLowerCase() === "release notes",
  );

  const { data: docsData } = useProjectDocuments(
    subdomain,
    projectSlug,
    matchedFolder ? { folder_id: matchedFolder.id } : undefined,
  );
  const docs = docsData?.results || [];

  const { mutateAsync: createFolderAsync } = useCreateDocumentFolder(
    subdomain,
    projectSlug,
  );
  const { mutateAsync: createDocAsync } = useCreateProjectDocument(
    subdomain,
    projectSlug,
  );

  const handleCopyMarkdown = () => {
    if (resultData?.release_notes?.markdown) {
      navigator.clipboard.writeText(resultData.release_notes.markdown);
      setCopied(true);
      toast.success("Markdown copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToKnowledgeBase = async () => {
    if (!resultData?.release_notes?.markdown) return;
    setIsAddingToKb(true);

    try {
      let targetFolderId = matchedFolder?.id;

      // 1. If folder does not exist, create it first
      if (!targetFolderId) {
        const newFolder = await createFolderAsync({ name: "Release Notes" });
        targetFolderId = newFolder.id;
      }

      // 2. Determine next version number based on existing documents in the folder
      let maxVersion = 0;
      docs.forEach((doc) => {
        const match = doc.title.match(/v(\d+)/i);
        if (match) {
          const ver = parseInt(match[1], 10);
          if (ver > maxVersion) maxVersion = ver;
        }
      });

      const nextVersion =
        maxVersion > 0 ? maxVersion + 1 : docs.length > 0 ? docs.length + 1 : 1;
      const documentTitle = `Release Notes v${nextVersion}`;

      // 3. Create the document with the markdown content
      await createDocAsync({
        folder_id: targetFolderId,
        title: documentTitle,
        content: resultData.release_notes.markdown,
      });

      toast.success(`Successfully added "${documentTitle}" to Knowledge Base.`);
    } catch (error: any) {
      // Error toast is already handled by mutation hooks, but catch here to stop loading state
    } finally {
      setIsAddingToKb(false);
    }
  };

  const renderHighlightList = (
    title: string,
    items: (ReleaseHighlightItem | string)[],
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
          {title} ({items.length})
        </h4>
        <div className="space-y-2">
          {items.map((item, idx) => {
            const isString = typeof item === "string";
            const itemTitle = isString ? item : item.title;
            const itemDesc = isString ? null : item.description;
            const itemCategory = isString ? null : item.category;
            const itemRefs = isString ? [] : item.references;

            return (
              <div
                key={idx}
                className="p-3 bg-black/40 border border-white/5 rounded-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white font-sans">
                    {itemTitle}
                  </span>
                  {itemCategory && (
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary font-mono">
                      {itemCategory}
                    </span>
                  )}
                </div>
                {itemDesc && (
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {itemDesc}
                  </p>
                )}
                {itemRefs && itemRefs.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {itemRefs.map((ref, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-black/60 border border-white/10 p-4 rounded-xs space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-mono">
              {resultData.release_notes.title}
            </h3>
            <p className="text-xs text-zinc-300 font-sans">
              {resultData.release_notes.overview}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={handleAddToKnowledgeBase}
              disabled={isAddingToKb}
              className="h-8 px-3 text-xs bg-primary text-black hover:bg-primary/90 font-semibold rounded-xs gap-1.5 cursor-pointer font-mono"
            >
              {isAddingToKb ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <FolderPlus className="h-3.5 w-3.5" /> Add to Knowledge Base
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleCopyMarkdown}
              className="h-8 px-3 text-xs bg-transparent text-primary hover:bg-transparent border border-primary/30 hover:border-primary font-semibold rounded-xs gap-1.5 cursor-pointer font-mono"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                  Markdown
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Markdown
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pt-2 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
          <span>
            Commits Analyzed: {resultData.source_summary.commits_analyzed}
          </span>
          <span>
            Pull Requests Analyzed:{" "}
            {resultData.source_summary.merged_pull_requests_analyzed}
          </span>
        </div>
      </div>

      {renderHighlightList("Highlights", resultData.release_notes.highlights)}
      {renderHighlightList(
        "Improvements",
        resultData.release_notes.improvements,
      )}
      {renderHighlightList("Bug Fixes", resultData.release_notes.bug_fixes)}
      {renderHighlightList(
        "Breaking Changes",
        resultData.release_notes.breaking_changes,
      )}
      {renderHighlightList(
        "Technical Changes",
        resultData.release_notes.technical_changes,
      )}
      {renderHighlightList(
        "Known Issues",
        resultData.release_notes.known_issues,
      )}
    </div>
  );
}
