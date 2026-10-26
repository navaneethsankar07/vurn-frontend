import { useSearchParams } from "react-router-dom";
import {
  Search,
  Loader2,
  FolderKanban,
  CheckSquare,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useGlobalSearch } from "../api/searchQueries";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { Button } from "@/components/ui/button";

export function GlobalSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGlobalSearch(query, 20);

  const results = data?.pages.flatMap((page) => page.results) || [];
  const total = data?.pages[0]?.count || 0;

  const handleSelectItem = (item: any) => {
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

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderKanban className="h-4 w-4 text-amber-500 shrink-0" />;
      case "issue":
        return <CheckSquare className="h-4 w-4 text-blue-400 shrink-0" />;
      case "sprint":
        return <Layers className="h-4 w-4 text-purple-400 shrink-0" />;
      default:
        return <Search className="h-4 w-4 text-zinc-400 shrink-0" />;
    }
  };

  const formatContextDetails = (item: any) => {
    if (item.entity_type === "project") {
      return item.organization_slug
        ? `Organization: ${item.organization_slug}`
        : "";
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
    <div className="max-w-4xl mx-auto py-8 px-4 font-mono text-white space-y-6">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
          <Search className="h-5 w-5 text-amber-500" />
          Search Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-xs text-zinc-400">
          Found {total} matching resource{total === 1 ? "" : "s"} across
          authorized projects and issues.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 flex items-center justify-center gap-2 text-zinc-500 text-xs">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <span>Searching authorized records...</span>
        </div>
      ) : isError ? (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center rounded-xs">
          Failed to load search results. Please try again.
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 text-xs italic">
          No matches found for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="p-4 bg-[#09090B] border border-white/10 rounded-xs hover:border-amber-500/50 transition-colors cursor-pointer group flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5">
                    {getEntityIcon(item.entity_type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-zinc-200 group-hover:text-white text-sm font-sans truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] bg-white/5 border border-white/5 text-amber-400 px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
                        {item.entity_type}{" "}
                        {item.identifier
                          ? `• ${item.identifier}`
                          : item.key
                            ? `• ${item.key}`
                            : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {formatContextDetails(item)}
                    </p>
                    {item.description && (
                      <p className="text-xs text-zinc-400 font-sans line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-zinc-500 uppercase">
                    {item.status || item.priority || ""}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="pt-4 text-center">
              <Button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-200 hover:text-white text-xs h-9 px-6 rounded-xs cursor-pointer gap-2 font-mono"
              >
                {isFetchingNextPage && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                )}
                <span>Show more results</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
