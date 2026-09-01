import { useNavigate } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReceivedInvitationsQuery } from "../api/organizationQueries";

export function OrganizationInvitationsPage() {
  const navigate = useNavigate();
  const { data: invitations, isLoading, error } = useReceivedInvitationsQuery();
    
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-amber-500" />
            Organization Invitations
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Review invitations from organizations that want you to join.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-xs rounded-sm">
            Failed to load invitations.
          </div>
        ) : !invitations || invitations.length === 0 ? (
          <div className="p-8 border border-white/10 rounded-sm text-center font-mono text-sm text-gray-500 bg-[#0C0C0E]">
            No invitations pending.
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="p-6 border border-white/10 rounded-sm bg-[#0C0C0E] space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-amber-500/20 text-amber-500 font-mono font-bold flex items-center justify-center rounded-sm text-sm border border-amber-500/30">
                    {inv.organization_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-mono font-bold text-sm">
                      {inv.organization_name}
                    </h2>
                    <p className="text-xs font-mono text-gray-500">
                      {inv.organization_slug}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    Expires {new Date(inv.expires_at).toLocaleDateString()}
                  </span>
                </div>

                {inv.personal_message && (
                  <p className="text-xs font-mono text-gray-300 bg-white/5 p-3 rounded-sm border border-white/5">
                    "{inv.personal_message}"
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    onClick={() => navigate(`/invitations/${inv.token}`)}
                    className="h-9 px-4 bg-amber-500 text-black font-mono font-semibold text-xs hover:bg-amber-500/90 rounded-sm"
                  >
                    View Invitation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
