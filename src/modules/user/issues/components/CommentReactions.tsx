import { useState, useRef, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { useCommentReactions } from "../api/issueQueries";
import {
  useSetCommentReaction,
  useDeleteCommentReaction,
} from "../api/issueMutations";
import { CommentReactionsModal } from "./modals/CommentReactionsModal";
import type {
  CommentReactionType,
  ReactionParams,
  CommentReactionSummary,
} from "../types";

const REACTION_CONFIG: {
  type: CommentReactionType;
  emoji: string;
}[] = [
  { type: "like", emoji: "👍" },
  { type: "heart", emoji: "❤️" },
  { type: "celebrate", emoji: "🎉" },
  { type: "laugh", emoji: "😂" },
  { type: "surprised", emoji: "😮" },
  { type: "sad", emoji: "😢" },
];

export function CommentReactions({
  subdomain,
  projectSlug,
  issueId,
  commentId,
}: ReactionParams) {
  const [showPicker, setShowPicker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: reactions } = useCommentReactions({
    subdomain,
    projectSlug,
    issueId,
    commentId,
  });

  const { mutate: setReaction } = useSetCommentReaction();
  const { mutate: deleteReaction } = useDeleteCommentReaction();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleSelectReaction = (reaction: CommentReactionType) => {
    setShowPicker(false);

    if (reactions?.my_reaction === reaction) {
      deleteReaction({
        subdomain,
        projectSlug,
        issueId,
        commentId,
      });
      return;
    }

    setReaction({
      subdomain,
      projectSlug,
      issueId,
      commentId,
      data: { reaction },
    });
  };

  const handleMainButtonClick = () => {
    if (reactions?.my_reaction) {
      deleteReaction({
        subdomain,
        projectSlug,
        issueId,
        commentId,
      });
    } else {
      handleSelectReaction("like");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPicker((prev) => !prev);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPicker(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const activeUserReaction = REACTION_CONFIG.find(
    (r) => r.type === reactions?.my_reaction,
  );

  const activeReactionsList = REACTION_CONFIG.filter((r) => {
    const detail = reactions?.[r.type];
    return typeof detail === "object" ? detail.count > 0 : (detail ?? 0) > 0;
  });

  const totalReactionsCount = REACTION_CONFIG.reduce((sum, r) => {
    const detail = reactions?.[r.type];
    const count = typeof detail === "object" ? detail.count : (detail ?? 0);
    return sum + count;
  }, 0);

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="inline-flex gap-2 items-center rounded-full bg-white/4 border border-white/10 hover:border-white/20 transition-all p-0.5">
          <button
            type="button"
            onClick={handleMainButtonClick}
            onContextMenu={handleContextMenu}
            className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
              activeUserReaction
                ? "bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30 scale-105"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/8"
            }`}
          >
            {activeUserReaction ? (
              <span className="text-[11px] leading-none select-none">
                {activeUserReaction.emoji}
              </span>
            ) : (
              <ThumbsUp className="h-3 w-3" />
            )}
          </button>

          {totalReactionsCount > 0 && (
            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="inline-flex items-center gap-1 pl-1 pr-1.5 h-5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center overflow-hidden">
                {activeReactionsList.slice(0, 3).map(({ type, emoji }) => (
                  <span
                    key={type}
                    className="text-[11px] leading-none select-none drop-shadow-xs"
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              <span className="font-mono text-[10px] font-medium leading-none">
                {totalReactionsCount}
              </span>
            </button>
          )}
        </div>

        {showPicker && (
          <div className="absolute bottom-full left-0 mb-1.5 z-30 flex items-center gap-1 bg-[#111113] border border-white/10 px-2 py-1 rounded-full shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            {REACTION_CONFIG.map(({ type, emoji }) => {
              const isSelected = reactions?.my_reaction === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectReaction(type)}
                  className={`h-6 w-6 flex items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-amber-400/20 ring-1 ring-amber-400/40 scale-110"
                      : "hover:bg-white/10 hover:scale-125"
                  }`}
                >
                  <span className="text-xs leading-none select-none">
                    {emoji}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <CommentReactionsModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        reactions={reactions as CommentReactionSummary}
      />
    </>
  );
}
