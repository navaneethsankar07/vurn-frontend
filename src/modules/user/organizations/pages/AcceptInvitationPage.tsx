import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useInvitationDetailQuery } from "../api/organizationQueries";
import { useAcceptInvitationMutation } from "../api/organizationMutations";
import { getOrganizationUrl } from "@/utils/organizationUrl"; // Adjust path if needed

export function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    data: detail,
    isLoading,
    error,
  } = useInvitationDetailQuery(token || "");
  const acceptMutation = useAcceptInvitationMutation();

  const handleAccept = () => {
    if (!token) return;
    acceptMutation.mutate(token, {
      onSuccess: (res) => {
        toast.success(res.message);
        // Redirect directly to the organization's subdomain
        window.location.href = getOrganizationUrl(res.organization_slug);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.error || "Failed to accept invitation.",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 select-none">
        <div className="max-w-md w-full border border-red-500/20 bg-[#0C0C0E] p-6 rounded-md text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-mono font-bold text-white">
            Invalid or Expired Invitation
          </h2>
          <p className="text-xs font-mono text-gray-400">
            This invitation link is invalid or has expired. Please ask the
            organization owner to send a new invitation.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-white/10 text-white font-mono text-xs hover:bg-white/20 rounded-md"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 select-none">
      <div className="max-w-md w-full border border-white/10 bg-[#0C0C0E] p-8 rounded-xl shadow-2xl space-y-6 text-center">
        <div className="h-16 w-16 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
          <Building2 className="h-8 w-8" />
        </div>

        <div>
          <h1 className="text-xl font-mono font-bold text-white">
            Join {detail.organization.name}
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-2">
            You have been invited to join{" "}
            <span className="text-white font-semibold">
              {detail.organization.name}
            </span>{" "}
            as a{" "}
            <span className="text-amber-500 font-semibold">
              {detail.job_role?.name || "Member"}
            </span>
            .
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          <Button
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
            className="h-11 w-full gap-2 bg-amber-500 text-black font-mono font-bold text-sm hover:bg-amber-500/90 rounded-md transition-colors"
          >
            {acceptMutation.isPending ? (
              <>
                Joining...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Accept Invitation
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
