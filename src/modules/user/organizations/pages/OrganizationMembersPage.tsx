import { useState } from "react";
import {
  UserPlus,
  Search,
  MoreHorizontal,
  ShieldAlert,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { InviteMemberModal } from "../modals/InviteMemberModal";
import { InvitationSuccessModal } from "../modals/InvitationSuccessModal";
import { type CreateInvitationResponse } from "../types";
import { getSubdomain } from "@/utils/subdomain";
import {
  useOrganizationAccess,
  useOrganizationMembers,
} from "../api/organizationQueries";
import { useOrganizationPermission } from "@/hooks/useOrganizationPermission";

export function OrganizationMembersPage() {
  const subdomain = getSubdomain() || "";
  const { data: accessData } = useOrganizationAccess(subdomain);
  const canInviteMembers = accessData?.can_invite_members ?? false;
  const canViewMembers = useOrganizationPermission("member.view");
  const canManageMembers = useOrganizationPermission("members.manage");

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "owner" | "admin" | "member"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: membersData, isLoading } = useOrganizationMembers({
    slug: subdomain,
    search: activeSearch,
    role: roleFilter,
    page,
    page_size: pageSize,
  });

  const inviteModal = useModal();
  const successModal = useModal();
  const [createdInvite, setCreatedInvite] =
    useState<CreateInvitationResponse | null>(null);

  const handleInvitationSuccess = (data: CreateInvitationResponse) => {
    setCreatedInvite(data);
    inviteModal.closeModal();
    successModal.openModal();
  };

  const handleInviteAnother = () => {
    successModal.closeModal();
    inviteModal.openModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  if (!canViewMembers) {
    return (
      <div className="bg-black text-white p-4 sm:p-8 font-mono flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center gap-3 p-6 rounded-sm border border-primary/60 text-primary text-xs text-center max-w-md w-full">
          <ShieldAlert className="h-8 w-8 shrink-0" />
          <span className="font-semibold text-sm">Access Restricted</span>
          <span className="text-text-primary">
            You do not have permission to view organization members. Please
            contact your organization administrator.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-mono font-bold">
              Organization Members
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Manage organization members, permissions and access.
            </p>
          </div>
          {canInviteMembers && (
            <Button
              onClick={inviteModal.openModal}
              className="h-10 gap-2 bg-transparent border border-primary/80 text-primary hover:text-primary/70 hover:border-primary/60 hover:bg-transparent font-mono font-semibold text-xs rounded w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search members..."
              className="pl-9 pr-9 h-10 border-white/10 bg-[#0C0C0E] text-white placeholder:text-gray-600 rounded-sm font-mono text-xs focus-visible:ring-amber-500/40"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(
                e.target.value as "all" | "owner" | "admin" | "member",
              );
              setPage(1);
            }}
            className="h-10 px-3 border border-white/10 bg-[#0C0C0E] text-xs font-mono text-gray-300 rounded-sm focus:outline-none"
          >
            <option value="all">All Members</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div className="border border-white/10 rounded-sm bg-[#0C0C0E] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs min-w-160">
            <thead className="border-b border-white/10 bg-white/5 text-gray-400">
              <tr>
                <th className="py-3 px-4 font-normal">Name</th>
                <th className="py-3 px-4 font-normal">Email</th>
                <th className="py-3 px-4 font-normal">Organization Role</th>
                <th className="py-3 px-4 font-normal">Job Role</th>
                <th className="py-3 px-4 font-normal">Invited By</th>
                <th className="py-3 px-4 font-normal">Joined</th>
                <th className="py-3 px-4 font-normal">Projects</th>
                {canManageMembers && (
                  <th className="py-3 px-4 font-normal text-right"></th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={canManageMembers ? 8 : 7}
                    className="py-8 text-center text-gray-500"
                  >
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading members...
                  </td>
                </tr>
              ) : membersData?.results.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManageMembers ? 8 : 7}
                    className="py-8 text-center text-gray-500"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                membersData?.results.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5">
                    <td className="py-3.5 px-4 font-semibold flex items-center gap-2">
                      <img
                        src={
                          member.avatar || "https://placehold.net/avatar.svg"
                        }
                        alt={member.name}
                        className="h-7 w-7 rounded-full object-cover shrink-0 border border-white/10"
                      />
                      <span>{member.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {member.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 border text-[11px] rounded-sm capitalize ${
                          member.role === "owner"
                            ? "border-amber-500/40 text-amber-500 bg-amber-500/10"
                            : "border-white/10 text-gray-300 bg-white/5"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {member.job_role?.name ?? "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {member.invited_by?.name ?? "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(member.joined_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {member.project_count}
                    </td>
                    {canManageMembers && (
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-gray-500 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
          <div>
            {membersData?.results.length ?? 0} of {membersData?.count ?? 0}{" "}
            members
          </div>
          {membersData && membersData.count > pageSize && (
            <div className="flex gap-2">
              <Button
                disabled={!membersData.previous}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="h-8 px-3 border border-white/10 bg-[#0C0C0E] text-white hover:bg-white/5 rounded-sm disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                disabled={!membersData.next}
                onClick={() => setPage((prev) => prev + 1)}
                className="h-8 px-3 border border-white/10 bg-[#0C0C0E] text-white hover:bg-white/5 rounded-sm disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {canInviteMembers && inviteModal.isOpen && (
        <InviteMemberModal
          slug={subdomain || "default-org"}
          onClose={inviteModal.closeModal}
          onSuccess={handleInvitationSuccess}
        />
      )}

      {canInviteMembers && successModal.isOpen && createdInvite && (
        <InvitationSuccessModal
          invitationUrl={createdInvite.invitation_url}
          onClose={successModal.closeModal}
          onInviteAnother={handleInviteAnother}
        />
      )}
    </div>
  );
}
