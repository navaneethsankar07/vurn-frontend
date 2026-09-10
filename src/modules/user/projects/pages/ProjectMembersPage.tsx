import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";

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
import { useModal } from "@/hooks/useModal";
import { AddProjectMemberModal } from "../components/modals/AddProjectMemberModal";
import { useProjectMembers } from "../api/projectQueries";

export function ProjectMembersPage() {
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortFilter, setSortFilter] = useState("name_asc");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProjectMembers(
    subdomain,
    projectSlug,
    {
      search: appliedSearch || undefined,
      sort: sortFilter || undefined,
      page,
      page_size: 10,
    },
  );

  const projectMembers = data?.results || [];
  const totalCount = data?.count || projectMembers.length;
  const totalPages = Math.ceil(totalCount / 10) || 1;

  const existingUserIds = projectMembers.map((member: any) =>
    Number(member.user_id ?? member.user?.id ?? member.id),
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setAppliedSearch(searchInput.trim());
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  };

  return (
    <div className="bg-black text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Project Members
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage organization members who have access to this project.
            </p>
          </div>

          <Button
            onClick={openAddModal}
            className="h-10 gap-2 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-xs w-full sm:w-auto transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="border border-white/10 rounded-xs bg-[#09090B] p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search members (Press Enter)..."
                className="pl-9 pr-9 h-10 border-white/10 bg-black text-white placeholder:text-zinc-600 rounded-xs text-xs focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={sortFilter}
                onValueChange={(val) => {
                  if (val) {
                    setSortFilter(val);
                    setPage(1);
                  }
                }}
              >
                <SelectTrigger className="w-40 h-10 border-white/10 bg-black text-xs text-white rounded-xs">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0E] rounded-none border-white/10 text-white text-xs">
                  <SelectItem className="rounded-none" value="name_asc">
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem className="rounded-none" value="name_desc">
                    Name (Z-A)
                  </SelectItem>
                  <SelectItem className="rounded-none" value="recently_joined">
                    Recently Joined
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="min-h-60 flex items-center justify-center text-zinc-400 text-sm">
              <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
              Loading project members...
            </div>
          ) : isError ? (
            <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-xs text-center font-sans">
              Failed to load project members.
            </div>
          ) : projectMembers.length === 0 ? (
            <div className="min-h-60 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Users className="h-10 w-10 text-zinc-600 mb-1" />
              <p className="text-sm font-medium text-zinc-300">
                No project members found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Avatar</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Project Role</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projectMembers.map((member: any) => (
                    <tr
                      key={member.id || member.user_id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={member.avatar || ""} />
                          <AvatarFallback className="bg-[#18181B] text-[10px] text-zinc-300 font-sans font-bold">
                            {member.full_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {member.full_name}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {member.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 border border-white/10 bg-white/5 text-zinc-300 rounded-xs text-[11px]">
                          {member.project_role || "Member"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {member.joined_at
                          ? format(new Date(member.joined_at), "MMM dd, yyyy")
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-text-primary hover:bg-white/10 rounded-xs"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 border-t border-white/5">
            <p className="text-[11px]">
              {totalCount} project member{totalCount === 1 ? "" : "s"} • Access
              is managed separately from organization membership.
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2 border-white/10 bg-black text-white hover:bg-white/5 text-[11px] rounded-xs disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                <span className="text-[11px]">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-7 px-2 border-white/10 bg-black text-white hover:bg-white/5 text-[11px] rounded-xs disabled:opacity-40"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddProjectMemberModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        subdomain={subdomain}
        projectSlug={projectSlug}
        existingUserIds={existingUserIds}
      />
    </div>
  );
}
