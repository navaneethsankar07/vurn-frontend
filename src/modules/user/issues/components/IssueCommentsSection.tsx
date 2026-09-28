import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateIssueComment } from "../api/issueMutations";

interface IssueCommentsSectionProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
}

export function IssueCommentsSection({
  subdomain,
  projectSlug,
  issueId,
}: IssueCommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { mutate: createComment, isPending } = useCreateIssueComment();

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || isPending) return;

    createComment(
      {
        subdomain,
        projectSlug,
        issueId,
        data: { content: trimmed },
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
        Comments
      </span>
      <div className="space-y-2">
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment... (Ctrl+Enter to post)"
          rows={2}
          className="bg-black border-white/10 text-white rounded-xs text-xs font-sans placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-amber-500 resize-none"
        />
        <div className="flex items-center justify-end">
          <Button
            type="button"
            disabled={!commentText.trim() || isPending}
            onClick={handleSubmitComment}
            className="h-7 bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold rounded-xs gap-1.5 px-3 transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            <span>Comment</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
