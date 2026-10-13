import { useState } from "react";
import { HelpQuickActions } from "../components/HelpQuickActions";
import { HelpTopicView } from "../components/HelpTopicView";
import { HelpArticleView } from "../components/HelpArticleView";
import { Search, X } from "lucide-react";
import { HelpArticlesList } from "../components/HelpArticlesList";

export function HelpCenterPage() {
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(
    null,
  );
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const activeSlug = selectedTopicSlug || selectedArticleSlug;

  return (
    <div className="min-h-full bg-black text-white p-4 sm:p-6 lg:p-0 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        {!activeSlug ? (
          <div className="space-y-8">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h1 className="text-lg font-bold tracking-tight uppercase text-white">
                Help & Documentation
              </h1>
              <p className="text-xs text-zinc-400 font-sans">
                Learn how to use Vurn and find answers to common questions.
              </p>
            </div>

            <HelpQuickActions
              onSelectTopic={(slug) => setSelectedTopicSlug(slug)}
            />

            <div className="space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Search Help
              </h2>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search help articles (Press Enter)..."
                  className="w-full bg-[#09090B] border border-white/10 pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 rounded-xs font-mono"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <HelpArticlesList
              searchQuery={activeSearch}
              onSelectArticle={(slug) => setSelectedArticleSlug(slug)}
            />
          </div>
        ) : selectedTopicSlug ? (
          <HelpTopicView
            slug={selectedTopicSlug}
            onBack={() => setSelectedTopicSlug(null)}
          />
        ) : (
          <HelpArticleView
            slug={selectedArticleSlug!}
            onBack={() => setSelectedArticleSlug(null)}
          />
        )}
      </div>
    </div>
  );
}
