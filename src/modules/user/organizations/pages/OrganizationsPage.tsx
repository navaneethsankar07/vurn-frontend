import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
} from "lucide-react";
import { useOrganizationOptionsQuery, useOrganizationsQuery } from "../api/organizationQueries";
import { OrganizationListItem } from "../components/OrganizationListItem";
import { OrganizationAvatar } from "../components/OrganizationAvatar";
import { getOrganizationUrl } from "@/utils/organizationUrl";
import { ITEMS_PER_PAGE } from "../constants";
import type { RoleFilter, SortOption } from "../types";

export function OrganizationsPage() {
  const { data, isLoading } = useOrganizationsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const {data: options} = useOrganizationOptionsQuery()

  const filteredAndSortedOrgs = useMemo(() => {
    let result = [...(data?.organizations || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (org) =>
          org.name.toLowerCase().includes(q) ||
          org.slug.toLowerCase().includes(q) ||
          org.description?.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((org) => org.role === roleFilter);
    }

    result.sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === "members") {
        return b.member_count - a.member_count;
      }
      if (sortOption === "projects") {
        return b.project_count - a.project_count;
      }
      return b.id - a.id;
    });

    return result;
  }, [data?.organizations, searchQuery, roleFilter, sortOption]);

  const totalPages =
    Math.ceil(filteredAndSortedOrgs.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedOrgs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedOrgs, currentPage]);

  const hasRecent = data?.recent && data.recent.length > 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-mono px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Organizations
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Select a workspace to continue or create a new organization.
            </p>
          </div>
          <Link
            to="/organizations/new"
            className="inline-flex items-center justify-center gap-2 rounded-[3px] border border-primary px-4 py-2 text-xs font-semibold text-primary hover:border-primary/70 hover:text-primary/70 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create organization
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search organizations..."
              className="w-full rounded-[3px] border border-white/10 bg-[#09090b] pl-9 pr-3.5 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-[3px] border border-white/10 bg-[#09090b] p-0.5 text-xs">
              {(["all", "owner", "member"] as RoleFilter[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setRoleFilter(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-[3px] capitalize transition-colors ${
                    roleFilter === tab
                      ? "bg-white/10 text-white font-medium"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex items-center rounded-[3px] border border-white/10 bg-[#09090b] px-2.5 py-1.5 text-xs text-gray-400">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500 mr-2 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="recent" className="bg-[#09090b] text-white">
                  Recent
                </option>
                <option value="name" className="bg-[#09090b] text-white">
                  Name
                </option>
                <option value="members" className="bg-[#09090b] text-white">
                  Members
                </option>
                <option value="projects" className="bg-[#09090b] text-white">
                  Projects
                </option>
              </select>
            </div>
          </div>
        </div>

        {hasRecent && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              Recently opened
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data?.recent.map((org) => (
                <a
                  key={org.id}
                  href={getOrganizationUrl(org.slug)}
                  className="flex items-center gap-3 p-3.5 rounded-[3px] border border-white/5 bg-[#09090b] hover:bg-[#121215] hover:border-white/15 transition-all"
                >
                  <OrganizationAvatar
                    name={org.name}
                    icon={org.icon}
                    accentColor={org.accent_color}
                    logoUrl={org.logo_url}
                    availableColors={options?.accent_colors}
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate">
                      {org.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate">
                      {org.last_opened_at || "Opened recently"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            All organizations
          </h2>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-[3px] border border-white/5 bg-[#09090b] animate-pulse"
                />
              ))}
            </div>
          ) : paginatedOrgs.length > 0 ? (
            <div className="space-y-2">
              {paginatedOrgs.map((org) => (
                <OrganizationListItem key={org.id} organization={org} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 rounded-[3px] border border-white/5 bg-[#09090b] text-center space-y-3">
              <Building2 className="h-8 w-8 text-gray-600" />
              <p className="text-xs text-gray-400">No organizations found.</p>
            </div>
          )}
        </div>

        {!isLoading && filteredAndSortedOrgs.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-500">
            <span>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                filteredAndSortedOrgs.length,
              )}{" "}
              to{" "}
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedOrgs.length,
              )}{" "}
              of {filteredAndSortedOrgs.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-[3px] border border-white/10 bg-[#09090b] text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-1.5 rounded-[3px] border border-white/10 bg-[#09090b] text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
