import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateIssueComment } from "../api/issueMutations";

interface IssueCommentEditFormProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  commentId: number;
  initialContent: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function IssueCommentEditForm({
  subdomain,
  projectSlug,
  issueId,
  commentId,
  initialContent,
  onCancel,
  onSuccess,
}: IssueCommentEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const { mutate: updateComment, isPending } = useUpdateIssueComment();

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;
    if (trimmed === initialContent.trim()) {
      onCancel();
      return;
    }

    updateComment(
      {
        subdomain,
        projectSlug,
        issueId,
        commentId,
        data: { content: trimmed },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onCancel();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="space-y-2 py-1">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Edit your comment... (Ctrl+Enter to save, Esc to cancel)"
        rows={2}
        autoFocus
        className="bg-black border-amber-500/50 text-white rounded-xs text-xs font-sans placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-amber-500 resize-none"
      />
      <div className="flex items-center justify-end gap-1.5">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
          className="h-6 px-2 text-[11px] border-white/10 bg-transparent text-zinc-400 hover:text-white rounded-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!content.trim() || isPending}
          onClick={handleSave}
          className="h-6 px-2.5 bg-amber-500 text-black hover:bg-amber-400 text-[11px] font-semibold rounded-xs gap-1 transition-colors"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
}
