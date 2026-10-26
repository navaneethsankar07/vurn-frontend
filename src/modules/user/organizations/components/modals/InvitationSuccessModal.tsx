import { useState } from "react";
import { Check, Copy, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InvitationSuccessModalProps {
  invitationUrl: string;
  onClose: () => void;
  onInviteAnother: () => void;
}

export function InvitationSuccessModal({
  invitationUrl,
  onClose,
  onInviteAnother,
}: InvitationSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(invitationUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = invitationUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-md rounded-sm border border-white/10 bg-[#0C0C0E] p-5 sm:p-6 shadow-2xl space-y-6 select-none max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-base font-mono font-semibold text-white">
            Invitation Sent
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success Icon & Message */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
          <div className="h-12 w-12 rounded-sm border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Check className="h-6 w-6" />
          </div>
          <p className="text-xs font-mono text-zinc-300">
            Invitation successfully created.
          </p>
        </div>

        {/* Invitation Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Invitation Link
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              readOnly
              value={invitationUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="h-10 border-white/10 bg-black/40 text-blue-400 font-mono text-xs rounded-sm focus-visible:ring-1 focus-visible:ring-primary/50 select-text truncate"
            />
            <Button
              onClick={handleCopy}
              className="h-10 px-4 gap-2 bg-transparent border border-primary/80 text-primary hover:text-primary/70 hover:border-primary/60 hover:bg-transparent font-mono font-semibold text-xs rounded-sm shrink-0 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Share this link with the invited user.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto h-9 text-zinc-400 hover:text-white hover:bg-white/5 rounded-sm font-mono text-xs"
          >
            Done
          </Button>
          <Button
            onClick={onInviteAnother}
            className="w-full sm:w-auto h-9 gap-2 bg-transparent border border-primary/80 text-primary hover:text-primary/70 hover:border-primary/60 hover:bg-transparent font-mono font-semibold text-xs rounded-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite Another Member
          </Button>
        </div>
      </div>
    </div>
  );
}
