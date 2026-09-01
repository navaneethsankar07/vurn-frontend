import { useState } from "react";
import { UserPlus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { InviteMemberModal } from "../modals/InviteMemberModal";
import { InvitationSuccessModal } from "../modals/InvitationSuccessModal";
import { type CreateInvitationResponse } from "../types";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationAccess } from "../api/organizationQueries";

const DUMMY_MEMBERS = [
  {
    id: "1",
    name: "Amara Okafor",
    email: "amara@acmelabs.io",
    role: "Member",
    status: "Active",
    joined: "Mar 08, 2025",
    projects: 4,
  },
  {
    id: "2",
    name: "Dana Whitfield",
    email: "dana@acmelabs.io",
    role: "Owner",
    status: "Active",
    joined: "Feb 11, 2024",
    projects: 6,
  },
  {
    id: "3",
    name: "Elena Rossi",
    email: "elena.rossi@northwind.dev",
    role: "Member",
    status: "Pending Invitation",
    joined: "—",
    projects: 1,
  },
  {
    id: "4",
    name: "Marcus Lindqvist",
    email: "marcus@acmelabs.io",
    role: "Member",
    status: "Active",
    joined: "Nov 14, 2025",
    projects: 3,
  },
  {
    id: "5",
    name: "Priya Nair",
    email: "priya@acmelabs.io",
    role: "Admin",
    status: "Active",
    joined: "May 02, 2024",
    projects: 4,
  },
  {
    id: "6",
    name: "Sam Okoye",
    email: "sam.okoye@acmelabs.io",
    role: "Member",
    status: "Active",
    joined: "Yesterday",
    projects: 2,
  },
  {
    id: "7",
    name: "Tobias Fischer",
    email: "tobias@northwind.dev",
    role: "Admin",
    status: "Pending Invitation",
    joined: "—",
    projects: 0,
  },
  {
    id: "8",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@acmelabs.io",
    role: "Admin",
    status: "Suspended",
    joined: "Sep 30, 2024",
    projects: 2,
  },
];

export function OrganizationMembersPage() {
  const subdomain = getSubdomain() || "";
  const { data: accessData } = useOrganizationAccess(subdomain);
  const canInviteMembers = accessData?.can_invite_members ?? false;

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold">
              Organization Members
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Manage organization members, permissions and access.
            </p>
          </div>
          {canInviteMembers && (
            <Button
              onClick={inviteModal.openModal}
              className="h-10 gap-2 bg-amber-500 text-black font-mono font-semibold text-xs hover:bg-amber-500/90 rounded-sm"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search members..."
              className="pl-9 h-10 border-white/10 bg-[#0C0C0E] text-white placeholder:text-gray-600 rounded-sm font-mono text-xs focus-visible:ring-amber-500/40"
            />
          </div>
          <select className="h-10 px-3 border border-white/10 bg-[#0C0C0E] text-xs font-mono text-gray-300 rounded-sm focus:outline-none">
            <option>All Members</option>
          </select>
        </div>

        <div className="border border-white/10 rounded-sm bg-[#0C0C0E] overflow-hidden">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-white/5 text-gray-400">
              <tr>
                <th className="py-3 px-4 font-normal">Name</th>
                <th className="py-3 px-4 font-normal">Email</th>
                <th className="py-3 px-4 font-normal">Organization Role</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Joined</th>
                <th className="py-3 px-4 font-normal">Projects</th>
                <th className="py-3 px-4 font-normal text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DUMMY_MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 font-semibold">{member.name}</td>
                  <td className="py-3.5 px-4 text-gray-400">{member.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 border text-[11px] rounded-sm ${
                        member.role === "Owner"
                          ? "border-amber-500/40 text-amber-500 bg-amber-500/10"
                          : "border-white/10 text-gray-300 bg-white/5"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 border text-[11px] rounded-sm ${
                        member.status === "Active"
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : member.status === "Pending Invitation"
                            ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                            : "border-red-500/30 text-red-400 bg-red-500/10"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{member.joined}</td>
                  <td className="py-3.5 px-4 text-gray-400">
                    {member.projects}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-gray-500 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs font-mono text-gray-500">
          {DUMMY_MEMBERS.length} of {DUMMY_MEMBERS.length} members
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
