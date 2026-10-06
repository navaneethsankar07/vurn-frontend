import { useState } from "react";
import { Plus, UserPlus, Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import { InviteMemberModal } from "./modals/InviteMemberModal";
import { InvitationSuccessModal } from "./modals/InvitationSuccessModal";
import { type CreateInvitationResponse } from "../types";
import { getSubdomain } from "@/utils/subdomain";

export function QuickActions() {
  const navigate = useNavigate();
  const subdomain = getSubdomain() || "";

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

  const handleSuccessModalClose = () => {
    successModal.closeModal();
    navigate("/members");
  };

  return (
    <>
      <div className="rounded border border-white/10 bg-[#09090b] p-4 space-y-3 font-mono">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Quick Actions
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate("/projects/create")}
            className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>Create Project</span>
          </button>
          <button
            type="button"
            onClick={inviteModal.openModal}
            className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5 text-primary" />
            <span>Invite Members</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/roles")}
            className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Manage Roles</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-primary" />
            <span>Organization Settings</span>
          </button>
        </div>
      </div>

      {inviteModal.isOpen && (
        <InviteMemberModal
          slug={subdomain || "default-org"}
          onClose={inviteModal.closeModal}
          onSuccess={handleInvitationSuccess}
        />
      )}

      {successModal.isOpen && createdInvite && (
        <InvitationSuccessModal
          invitationUrl={createdInvite.invitation_url}
          onClose={handleSuccessModalClose}
          onInviteAnother={handleInviteAnother}
        />
      )}
    </>
  );
}
