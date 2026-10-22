import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useReceivedInvitationsQuery } from "@/modules/user/organizations/api/organizationQueries";

export function PendingInvitationsSection() {
  const navigate = useNavigate();
  const { data: invitations, isLoading } = useReceivedInvitationsQuery();

  if (isLoading || !invitations || invitations.length === 0) return null;

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Pending Invitations
        </h3>
        {invitations.length > 3 && (
          <button
            type="button"
            onClick={() => navigate("/invitations")}
            className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-2">
        {invitations.slice(0, 3).map((invitation: any) => (
          <div
            key={invitation.id || invitation.uuid}
            className="rounded border border-white/10 bg-[#09090b] p-4 flex items-center justify-between hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded border border-primary/20 flex items-center justify-center text-text-primary font-bold text-xs shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-semibold text-white truncate">
                  {invitation.organization_name ||
                    invitation.organization?.name ||
                    "Organization"}
                </h4>
                <p className="text-[10px] text-zinc-400 font-sans truncate">
                  Invited by{" "}
                  {invitation.invited_by_name ||
                    invitation.invited_by ||
                    "Administrator"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/invitations/${invitation.token}`)}
              className="text-xs text-text-primary hover:underline flex items-center gap-1 cursor-pointer font-semibold shrink-0"
            >
              View <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
