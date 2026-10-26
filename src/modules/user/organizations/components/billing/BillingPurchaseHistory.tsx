import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { useCreditPurchaseHistory } from "../../api/organizationQueries";
import type { CreditPurchaseRecord } from "../../types";

interface BillingPurchaseHistoryProps {
  organizationSlug: string;
}

export function BillingPurchaseHistory({
  organizationSlug,
}: BillingPurchaseHistoryProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCreditPurchaseHistory(organizationSlug, page);

  const results = data?.results || [];
  const totalCount = data?.count || 0;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatPlanName = (planKey: string) => {
    return planKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadgeStyles = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "success" || lower === "paid" || lower === "completed") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }
    if (lower === "failed" || lower === "cancelled" || lower === "error") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  };

  return (
    <div className="rounded border border-white/10 bg-[#09090b] shadow-xl overflow-hidden font-mono">
      <div className="border-b border-white/10 p-5 sm:p-6 space-y-1">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" /> Credit Purchase History
        </h2>
        <p className="text-gray-400 text-[11px]">
          Record of token pack purchases and transactions.
        </p>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-zinc-500 gap-2 text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading purchase history...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs italic">
            No credit purchases recorded yet.
          </div>
        ) : (
          <div className="border border-white/10 rounded-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-semibold">Plan</th>
                  <th className="p-3 font-semibold">Credits Added</th>
                  <th className="p-3 font-semibold">Amount Paid</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Purchased By</th>
                  <th className="p-3 font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {results.map((record: CreditPurchaseRecord) => (
                  <tr
                    key={record.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 font-bold text-white">
                      {formatPlanName(record.plan_key)}
                    </td>
                    <td className="p-3 font-bold text-emerald-400">
                      +{record.credits.toLocaleString()} credits
                    </td>
                    <td className="p-3 text-white">
                      ₹{(record.amount / 100).toFixed(2)} {record.currency}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border uppercase font-semibold ${getStatusBadgeStyles(
                          record.status,
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      {record.user?.username || `User #${record.user?.id}`}
                    </td>
                    <td className="p-3 text-zinc-400 text-[11px]">
                      {formatDate(record.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
            <span>
              Page {page} of {totalPages} ({totalCount} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-colors"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
