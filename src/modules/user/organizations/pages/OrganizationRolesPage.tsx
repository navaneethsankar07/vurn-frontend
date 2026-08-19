import { useState } from "react";
import {
  Search,
  Plus,
  KeyRound,
  Users,
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  ArrowDown,
  ArrowUp,
  Check,
} from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationRolesQuery } from "../api/organizationQueries";

const SORT_OPTIONS = [
  { label: "Date Updated", value: "updated_at" },
  { label: "Date Created", value: "created_at" },
  { label: "Role Name", value: "name" },
];

export function OrganizationRolesPage() {
  const subdomain = getSubdomain() || "";

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortField, setSortField] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const ordering = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleSelectSort = (value: string) => {
    setSortField(value);
    setIsSortOpen(false);
    setPage(1);
  };

  const { data, isLoading, isError } = useOrganizationRolesQuery(subdomain, {
    search: activeSearch || undefined,
    ordering,
    page,
    page_size: pageSize,
  });

  const roles = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortField)?.label || "Sort";

  const formatUpdatedDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays}d ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)}w ago`;
    return `Updated ${date.toLocaleDateString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 font-mono text-white sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Organization Roles
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Manage organization roles and permissions.
          </p>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-primary/90 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Create Role
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search roles (Press Enter)..."
            className="w-full rounded-[3px] border border-white/10 bg-[#09090b] py-2 pl-9 pr-10 text-xs text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-[3px] border border-white/10 bg-[#09090b] px-3 py-2 text-xs text-gray-300 hover:border-white/20 transition-colors cursor-pointer"
            >
              <span className="text-gray-500">Sort</span>
              <span className="text-white">{activeSortLabel}</span>
              <ChevronDown
                className={`size-3.5 text-gray-400 transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-[3px] border border-white/10 bg-[#09090b] py-1 shadow-xl">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectSort(option.value)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {sortField === option.value && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSortOrder}
            title={sortOrder === "desc" ? "Descending" : "Ascending"}
            className="flex size-8 items-center justify-center rounded-[3px] border border-white/10 bg-[#09090b] text-primary hover:border-primary/50 transition-colors cursor-pointer"
          >
            {sortOrder === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : (
              <ArrowUp className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : isError || !subdomain ? (
        <div className="rounded-[3px] border border-white/10 bg-[#09090b] p-6 text-center text-xs text-red-400">
          Failed to load organization roles.
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-[3px] border border-white/10 bg-[#09090b] p-8 text-center text-xs text-gray-400">
          No roles found matching your query.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex flex-col justify-between overflow-hidden rounded-[3px] border border-white/10 bg-[#09090b] p-4 sm:p-5 transition-colors hover:border-white/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-white/5 border border-white/10"
                        style={{
                          borderColor: role.color
                            ? `${role.color}40`
                            : undefined,
                        }}
                      >
                        <KeyRound
                          className="size-3.5"
                          style={{ color: role.color || "var(--primary)" }}
                        />
                      </div>
                      <h3 className="truncate text-sm font-semibold text-white">
                        {role.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="cursor-pointer text-gray-500 hover:text-white transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400 line-clamp-2 min-h-8">
                    {role.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-gray-500" />
                      {role.members_count ?? 0} Members
                    </span>
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="size-3.5 text-gray-500" />
                      {role.permissions?.length || 0} Permissions
                    </span>
                  </div>
                  <span>{formatUpdatedDate(role.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
              <span>
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, totalCount)} of {totalCount} roles
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-[3px] border border-white/10 bg-[#09090b] px-3 py-1.5 text-xs text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="size-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 rounded-[3px] border border-white/10 bg-[#09090b] px-3 py-1.5 text-xs text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
