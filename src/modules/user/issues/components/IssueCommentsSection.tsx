import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateIssueComment } from "../api/issueMutations";
import { useIssueComments } from "../api/issueQueries";
import { IssueCommentList } from "./IssueCommentList";
import type { CommentSortOption } from "../types";

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
  const [sortOption, setSortOption] = useState<CommentSortOption>("newest");

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useIssueComments({
      subdomain,
      projectSlug,
      issueId,
      sort: sortOption,
    });

  const comments = data?.pages.flatMap((page) => page.results) || [];
  const totalCount = data?.pages[0]?.count || 0;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Comments ({totalCount})
        </span>

        <Select
          value={sortOption}
          onValueChange={(val: string | null) => {
            if (val) setSortOption(val as CommentSortOption);
          }}
        >
          <SelectTrigger className="h-6 w-24 border border-white/10 bg-black text-[11px] rounded-xs text-zinc-300 px-2 py-0 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="end"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="bg-[#09090B] border-white/10 text-white font-mono rounded-none text-xs min-w-24"
          >
            <SelectItem
              value="oldest"
              className="rounded-xs cursor-pointer text-xs"
            >
              Oldest
            </SelectItem>
            <SelectItem
              value="newest"
              className="rounded-xs cursor-pointer text-xs"
            >
              Newest
            </SelectItem>
            <SelectItem
              value="top"
              className="rounded-xs cursor-pointer text-xs"
            >
              Top
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <IssueCommentList
        subdomain={subdomain}
        projectSlug={projectSlug}
        issueId={issueId}
        comments={comments}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        totalCount={totalCount}
      />

      <div className="space-y-2 pt-2 border-t border-white/5">
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
