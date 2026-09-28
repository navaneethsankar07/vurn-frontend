import { useState, useRef, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { useCommentReactions } from "../api/issueQueries";
import { useSetCommentReaction } from "../api/issueMutations";
import type { CommentReactionType, ReactionParams } from "../types";

const REACTION_CONFIG: {
  type: CommentReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "heart", emoji: "❤️", label: "Heart" },
  { type: "laugh", emoji: "😂", label: "Laugh" },
  { type: "celebrate", emoji: "🎉", label: "Celebrate" },
  { type: "surprised", emoji: "😮", label: "Surprised" },
  { type: "sad", emoji: "😢", label: "Sad" },
];

export function CommentReactions({
  subdomain,
  projectSlug,
  issueId,
  commentId,
}: ReactionParams) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: reactions } = useCommentReactions({
    subdomain,
    projectSlug,
    issueId,
    commentId,
  });

  const { mutate: setReaction } = useSetCommentReaction();

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
    if (reactions?.my_reaction === reaction) return;

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
      setShowPicker((prev) => !prev);
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
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const activeConfig = REACTION_CONFIG.find(
    (r) => r.type === reactions?.my_reaction,
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleMainButtonClick}
        onContextMenu={handleContextMenu}
        title={activeConfig ? `Reacted: ${activeConfig.label}` : "Add reaction"}
        className={`flex items-center justify-center h-5 px-1.5 rounded-xs transition-colors ${
          reactions?.my_reaction
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
        }`}
      >
        {activeConfig ? (
          <span className="text-xs leading-none">{activeConfig.emoji}</span>
        ) : (
          <ThumbsUp className="h-3 w-3" />
        )}
      </button>

      {showPicker && (
        <div className="absolute bottom-full left-0 mb-1.5 z-30 flex items-center gap-0.5 bg-[#121214] border border-white/10 px-1.5 py-1 rounded-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {REACTION_CONFIG.map(({ type, emoji, label }) => {
            const isSelected = reactions?.my_reaction === type;
            return (
              <button
                key={type}
                type="button"
                title={label}
                onClick={() => handleSelectReaction(type)}
                className={`p-1 hover:scale-125 transition-transform rounded-full ${
                  isSelected
                    ? "bg-amber-500/20 ring-1 ring-amber-500/40 scale-110"
                    : ""
                }`}
              >
                <span className="text-sm leading-none block">{emoji}</span>
              </button>
            );
          })}
        </div>
      )}

      {reactions && (
        <div className="flex items-center gap-1">
          {REACTION_CONFIG.map(({ type, emoji, label }) => {
            const count = reactions[type];
            if (!count || count <= 0) return null;
            const isSelected = reactions.my_reaction === type;

            return (
              <button
                key={type}
                type="button"
                title={`${count} ${label}`}
                onClick={() => handleSelectReaction(type)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-full border transition-colors ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-medium"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                }`}
              >
                <span className="leading-none text-[11px]">{emoji}</span>
                <span className="font-mono text-[9px]">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
