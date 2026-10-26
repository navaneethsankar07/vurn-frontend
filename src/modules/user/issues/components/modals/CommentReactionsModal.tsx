import { useState, useEffect } from "react";
import { X, Users } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type {
  CommentReactionSummary,
  CommentReactionType,
  ReactedUser,
} from "../../types";

const REACTION_CONFIG: {
  type: CommentReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "heart", emoji: "❤️", label: "Heart" },
  { type: "celebrate", emoji: "🎉", label: "Celebrate" },
  { type: "laugh", emoji: "😂", label: "Laugh" },
  { type: "surprised", emoji: "😮", label: "Surprised" },
  { type: "sad", emoji: "😢", label: "Sad" },
];

interface CommentReactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactions?: CommentReactionSummary;
}

interface FlattenedReactedUser extends ReactedUser {
  reaction: CommentReactionType;
}

export function CommentReactionsModal({
  isOpen,
  onClose,
  reactions,
}: CommentReactionsModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | CommentReactionType>(
    "all",
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !reactions) return null;

  const totalCount = REACTION_CONFIG.reduce((acc, { type }) => {
    return acc + (reactions[type]?.count || 0);
  }, 0);

  const allUsers: FlattenedReactedUser[] = REACTION_CONFIG.flatMap(
    ({ type }) => {
      const list = reactions[type]?.users || [];
      return list.map((user) => ({ ...user, reaction: type }));
    },
  );

  const displayedUsers: FlattenedReactedUser[] =
    activeTab === "all"
      ? allUsers
      : (reactions[activeTab]?.users || []).map((user) => ({
          ...user,
          reaction: activeTab,
        }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#09090B] border border-white/10 rounded-xs shadow-2xl flex flex-col max-h-115 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-100 tracking-wide font-sans">
              Reactions
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {totalCount}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-xs transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-3 pt-2 pb-0 border-b border-white/10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-2.5 pb-2 text-[11px] font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === "all"
                ? "border-zinc-200 text-zinc-100"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>All</span>
            <span className="font-mono text-[10px] text-zinc-400">
              {totalCount}
            </span>
          </button>

          {REACTION_CONFIG.map(({ type, emoji }) => {
            const count = reactions[type]?.count || 0;
            if (count <= 0) return null;
            const isActive = activeTab === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-1.5 px-2.5 pb-2 text-[11px] font-medium transition-colors border-b-2 shrink-0 ${
                  isActive
                    ? "border-zinc-200 text-zinc-100"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span className="text-xs leading-none select-none">
                  {emoji}
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
          {displayedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-1.5">
              <Users className="h-4 w-4 text-zinc-600" />
              <span className="text-[11px] font-sans">
                No reactions in this category
              </span>
            </div>
          ) : (
            displayedUsers.map((user, idx) => {
              const reactionEmoji =
                REACTION_CONFIG.find((r) => r.type === user.reaction)?.emoji ||
                "👍";
              const isCurrentUser = currentUserId && user.id === currentUserId;

              return (
                <div
                  key={`${user.id}-${user.reaction}-${idx}`}
                  className="flex items-center justify-between px-2.5 py-2 hover:bg-white/5 rounded-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-7 w-7 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <span className="h-7 w-7 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-semibold flex items-center justify-center">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                      <span className="absolute -bottom-1 -right-1 text-[10px] leading-none bg-[#09090B] rounded-full p-0.5 border border-white/10 select-none">
                        {reactionEmoji}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs text-zinc-200 font-sans truncate">
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 border border-white/10 px-1 py-0.5 rounded-xs leading-none shrink-0">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
