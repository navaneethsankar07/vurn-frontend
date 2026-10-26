import { TrendingUp } from "lucide-react";

interface BillingUsageStatsProps {
  creditsUsedToday: number;
  creditsUsedThisMonth: number;
  averageDailyUsage: string;
}

export function BillingUsageStats({
  creditsUsedToday,
  creditsUsedThisMonth,
  averageDailyUsage,
}: BillingUsageStatsProps) {
  return (
    <div className="rounded border border-white/10 bg-[#09090b] shadow-xl">
      <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
        <h2 className="text-sm font-semibold text-white">Usage Statistics</h2>
        <p className="text-gray-400 text-[11px]">
          Current organization token consumption.
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 divide-white/10 p-5 sm:p-6 gap-6 sm:gap-0">
        <div className="sm:pr-6 space-y-1">
          <div className="text-gray-400 text-[11px]">Tokens Used Today</div>
          <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            {creditsUsedToday.toLocaleString()}
          </div>
        </div>

        <div className="sm:px-6 pt-4 sm:pt-0 space-y-1">
          <div className="text-gray-400 text-[11px]">
            Tokens Used This Month
          </div>
          <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            {creditsUsedThisMonth.toLocaleString()}
          </div>
        </div>

        <div className="sm:pl-6 pt-4 sm:pt-0 space-y-1">
          <div className="text-gray-400 text-[11px]">Average Daily Usage</div>
          <div className="flex items-center gap-2 text-white font-semibold text-base select-text">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            {averageDailyUsage}
          </div>
        </div>
      </div>
    </div>
  );
}
