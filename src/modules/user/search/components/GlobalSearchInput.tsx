import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Loader2,
  FolderKanban,
  CheckSquare,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchSuggestions } from "../api/searchQueries";
import { getOrganizationUrl } from "@/utils/organizationUrl";

export function GlobalSearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      if (searchTerm.trim().length >= 2) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading } = useSearchSuggestions(debouncedQuery);
  const results = data?.results || [];

  const handleSelectResult = (item: any) => {
    setIsOpen(false);
    setSearchTerm("");

    const orgSlug = item.organization_slug;
    const projSlug = item.project_slug || item.project_key?.toLowerCase();

    if (!orgSlug) return;

    if (item.entity_type === "project") {
      window.location.href = getOrganizationUrl(
        orgSlug,
        `/projects/${projSlug}`,
      );
    } else if (item.entity_type === "issue") {
      window.location.href = getOrganizationUrl(
        orgSlug,
        `/projects/${projSlug}/issues?selectedIssue=${item.entity_id}`,
      );
    } else if (item.entity_type === "sprint") {
      window.location.href = getOrganizationUrl(
        orgSlug,
        `/projects/${projSlug}/sprints/${item.entity_id}`,
      );
    }
  };

  const handleViewAllResults = () => {
    if (!searchTerm.trim()) return;
    setIsOpen(false);
    window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleViewAllResults();
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderKanban className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      case "issue":
        return <CheckSquare className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
      case "sprint":
        return <Layers className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
      default:
        return <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
    }
  };

  const formatContextDetails = (item: any) => {
    if (item.entity_type === "project") {
      return item.organization_slug ? `Org: ${item.organization_slug}` : "";
    }
    if (item.entity_type === "issue" || item.entity_type === "sprint") {
      const parts = [];
      if (item.organization_slug) parts.push(`Org: ${item.organization_slug}`);
      if (item.project_slug || item.project_key)
        parts.push(`Project: ${item.project_slug || item.project_key}`);
      return parts.join(" • ");
    }
    return "";
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl" ref={containerRef}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.trim().length >= 2) setIsOpen(true);
        }}
        placeholder="Search resources, organizations, or issues..."
        className="h-10 rounded-[3px] border-white/10 bg-white/3 pl-9 pr-20 text-sm text-white placeholder:text-gray-500 focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-0"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <kbd className="pointer-events-none hidden items-center gap-1 rounded-[3px] border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:flex">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>

      {isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl max-h-96 overflow-y-auto font-mono text-xs divide-y divide-white/5">
          {isLoading ? (
            <div className="py-8 flex items-center justify-center gap-2 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              <span>Searching suggestions...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 italic">
              No results found for &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            <>
              <div className="py-1.5 px-3 text-[10px] uppercase text-zinc-500 font-bold bg-black/40">
                Quick Matches
              </div>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getEntityIcon(item.entity_type)}
                    <div className="truncate flex flex-col space-y-0.5">
                      <span className="font-semibold text-zinc-200 group-hover:text-white truncate text-xs font-sans">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
                        {item.entity_type} {item.key ? `• ${item.key}` : ""}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {formatContextDetails(item)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono shrink-0 capitalize">
                    {item.status || item.priority || ""}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={handleViewAllResults}
                className="w-full p-3 flex items-center justify-between bg-black/60 hover:bg-white/10 text-amber-400 transition-colors cursor-pointer font-semibold"
              >
                <span>See all results for &ldquo;{searchTerm}&rdquo;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
