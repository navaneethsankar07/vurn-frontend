import Coin3Line from "@/utils/icons";

interface BillingTokenBalanceProps {
  remainingCredits: number;
}

export function BillingTokenBalance({
  remainingCredits,
}: BillingTokenBalanceProps) {
  return (
    <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
      <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
        <h2 className="text-sm font-semibold text-white">
          VURN AI Token Balance
        </h2>
        <p className="text-gray-400 text-[11px]">
          Tokens power AI features across your Vurn workspace.
        </p>
      </div>

      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Coin3Line size="30" />

          <div className="space-y-0.5">
            <div className="text-lg font-bold text-white tracking-tight select-text">
              {remainingCredits.toLocaleString()}{" "}
              <span className="text-xs font-normal text-gray-400">
                AI Tokens
              </span>
            </div>
            <p className="text-gray-400 text-[11px]">
              Available credits for AI operations in your organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
