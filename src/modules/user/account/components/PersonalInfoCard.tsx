import type { PersonalInfoCardProps } from "../types";
import { formatDate, formatDateTime } from "@/utils/date";

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const infoItems = [
    { label: "Full Name", value: user.full_name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Account Created", value: formatDate(user.created_at) },
    { label: "Last Login", value: formatDateTime(user.last_login) },
  ];

  return (
    <div className="rounded-[3px] border border-white/10 bg-[#0C0C0E] font-mono overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-normal text-white">Personal Information</h3>
      </div>
      <div className="divide-y divide-white/10">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-5 py-3.5 text-xs sm:text-sm"
          >
            <span className="text-gray-400">{item.label}</span>
            <span className="text-gray-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}