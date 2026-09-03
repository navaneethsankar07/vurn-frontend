import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Loader2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Folder,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSubdomain } from "@/utils/subdomain";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { useOrganizationAccess } from "../../organizations/api/organizationQueries";
import { useProjects } from "../api/projectQueries";
import type { ProjectListParams } from "../types";

export function ProjectsPage() {
  const navigate = useNavigate();
  const subdomain = getSubdomain() || "";

  const { data: accessData } = useOrganizationAccess(subdomain);
  const canCreateProjects = accessData?.can_create_projects ?? false;

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState<
    "recently_created" | "recently_updated" | "name_asc" | "name_desc"
  >("recently_updated");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const queryParams: ProjectListParams = {
    search: activeSearch.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    archive: statusFilter === "archived" ? "archived" : "active",
    sort: sortFilter,
    page,
    page_size: 10,
  };

  const { data, isLoading, isError, error } = useProjects(
    subdomain,
    queryParams,
  );

  const projects = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const isFiltered = Boolean(activeSearch.trim() || statusFilter !== "all");

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setPage(1);
    }
  };

  // Function to extract backend response error message dynamically
  const getErrorMessage = () => {
    if (!error) return "Failed to load projects. Please try again later.";

    const axiosError = error as {
      response?: {
        data?: {
          error?: string;
          detail?: string;
          message?: string;
        };
      };
      message?: string;
    };

    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to load projects. Please try again later."
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Projects
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage all engineering projects within this organization.
            </p>
          </div>

          {canCreateProjects && (
            <Button
              onClick={() => navigate("/projects/create")}
              className="h-10 gap-2 bg-transparent border-primary text-primary hover:bg-transparent hover:text-primary/60 hover:border-primary/70 font-semibold text-xs rounded w-full sm:w-auto transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search projects..."
              className="pl-9 h-10 border-white/10 bg-[#0C0C0E] text-white placeholder:text-gray-500 rounded-sm text-xs focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                if (val) {
                  setStatusFilter(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-35 h-10 border-white/10 bg-[#0C0C0E] text-xs text-white rounded-sm">
                <SelectValue>
                  {statusFilter === "all" && "All Status"}
                  {statusFilter === "active" && "Active"}
                  {statusFilter === "archived" && "Archived"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0E] border-white/10 text-white text-xs">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortFilter}
              onValueChange={(val) => {
                if (val) {
                  setSortFilter(
                    val as
                      | "recently_created"
                      | "recently_updated"
                      | "name_asc"
                      | "name_desc",
                  );
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-40 h-10 border-white/10 bg-[#0C0C0E] text-xs text-white rounded-sm">
                <SelectValue>
                  {sortFilter === "recently_updated" && "Recently Updated"}
                  {sortFilter === "recently_created" && "Recently Created"}
                  {sortFilter === "name_asc" && "Name (A-Z)"}
                  {sortFilter === "name_desc" && "Name (Z-A)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0E] border-white/10 text-white text-xs">
                <SelectItem value="recently_updated">
                  Recently Updated
                </SelectItem>
                <SelectItem value="recently_created">
                  Recently Created
                </SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border border-white/10 rounded-sm bg-[#0C0C0E] p-1 gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 rounded-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-white/10 text-white shadow-xs"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 rounded-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-white/10 text-white shadow-xs"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-semibold">
          {totalCount} {totalCount === 1 ? "project" : "projects"}
        </div>

        {isLoading ? (
          <div className="min-h-75 flex items-center justify-center text-gray-400 text-sm">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
            Loading projects...
          </div>
        ) : isError ? (
          <div className="min-h-50 border border-red-500/20 bg-red-500/5 rounded-sm flex items-center justify-center text-red-400 text-xs px-4 text-center font-sans">
            {getErrorMessage()}
          </div>
        ) : projects.length === 0 ? (
          <div className="min-h-75 border border-white/10 rounded-sm bg-[#0C0C0E] flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Folder className="h-10 w-10 text-gray-600 mb-1" />
            <p className="text-sm font-medium text-gray-300">
              {isFiltered ? "No matching projects found" : "No projects found"}
            </p>
            <p className="text-xs text-gray-500 max-w-sm">
              {isFiltered
                ? "Try adjusting your search criteria or clearing filters."
                : "Get started by creating a new project for your team."}
            </p>
            {!isFiltered && canCreateProjects && (
              <Button
                onClick={() => navigate("/projects/create")}
                className="h-10 gap-2 bg-transparent border-primary text-primary hover:bg-transparent hover:text-primary/60 hover:border-primary/70 font-semibold text-xs rounded transition-colors mt-2"
              >
                <Plus className="h-4 w-4" />
                Create your first project
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-white/10 rounded-sm bg-[#0C0C0E] p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-9 w-9 rounded-sm flex items-center justify-center border border-white/10 shrink-0"
                        style={{
                          backgroundColor: `${project.accent_color || "#F59E0B"}15`,
                          color: project.accent_color || "#F59E0B",
                        }}
                      >
                        {renderOrgIcon(project.icon || "", {
                          className: "h-5 w-5",
                        })}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block truncate">
                          KEY: {project.key}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-sm capitalize border shrink-0 ${
                        project.status === "active"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-gray-500/30 text-gray-400 bg-gray-500/10"
                      }`}
                    >
                      • {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 min-h-8 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-5 w-5 border border-white/10 shrink-0">
                        <AvatarImage src={project.project_lead?.avatar || ""} />
                        <AvatarFallback className="bg-black text-[9px] text-gray-300">
                          {project.project_lead?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] truncate">
                        {project.project_lead?.name || "Unassigned"}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                      {formatDistanceToNow(new Date(project.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => navigate(`/projects/${project.slug}`)}
                      className="flex-1 h-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs rounded-sm font-medium transition-colors"
                    >
                      Open Project
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-sm"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 rounded-sm bg-[#0C0C0E] divide-y divide-white/5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className="h-9 w-9 rounded-sm flex items-center justify-center border border-white/10 shrink-0"
                    style={{
                      backgroundColor: `${project.accent_color || "#F59E0B"}15`,
                      color: project.accent_color || "#F59E0B",
                    }}
                  >
                    {renderOrgIcon(project.icon || "", {
                      className: "h-5 w-5",
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest shrink-0">
                        ({project.key})
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] rounded-sm capitalize border shrink-0 ${
                          project.status === "active"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-gray-500/30 text-gray-400 bg-gray-500/10"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xl">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5 border border-white/10 shrink-0">
                      <AvatarImage src={project.project_lead?.avatar || ""} />
                      <AvatarFallback className="bg-black text-[9px] text-gray-300">
                        {project.project_lead?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-300 truncate max-w-30">
                      {project.project_lead?.name || "Unassigned"}
                    </span>
                  </div>

                  <span className="text-[10px] text-gray-500 hidden md:inline-block w-28 text-right">
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => navigate(`/projects/${project.slug}`)}
                      className="h-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs rounded-sm font-medium transition-colors px-3"
                    >
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-sm"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-gray-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 border-white/10 bg-[#0C0C0E] text-white hover:bg-white/5 disabled:opacity-40 rounded-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 border-white/10 bg-[#0C0C0E] text-white hover:bg-white/5 disabled:opacity-40 rounded-sm"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
