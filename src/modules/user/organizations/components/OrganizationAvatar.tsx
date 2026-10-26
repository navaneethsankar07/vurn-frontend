import { renderOrgIcon } from "@/utils/renderOrgIcon";

interface AccentColorOption {
  name: string;
  value: string;
}

interface OrganizationAvatarProps {
  name: string;
  icon: string;
  accentColor: string; 
  logoUrl?: string | null;
  availableColors?: AccentColorOption[];
  size?: "sm" | "md" | "lg";
}

export function OrganizationAvatar({
  icon,
  accentColor,
  logoUrl,
  availableColors = [],
  size = "md",
}: OrganizationAvatarProps) {
  const resolvedHex = accentColor?.startsWith("#")
    ? accentColor
    : availableColors.find((c) => c.name === accentColor)?.value || "#F59E0B";

  const sizeClasses = {
    sm: "h-8 w-8 text-xs rounded-[3px]",
    md: "h-10 w-10 text-sm rounded-[3px]",
    lg: "h-12 w-12 text-base rounded-[4px]",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Organization Logo"
        className={`${sizeClasses[size]} object-cover border border-white/10`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center border font-semibold shrink-0 transition-colors ${sizeClasses[size]}`}
      style={{
        borderColor: `${resolvedHex}40`,
        backgroundColor: `${resolvedHex}15`,
        color: resolvedHex,
      }}
    >
      {renderOrgIcon(icon, { className: iconSizes[size] })}
    </div>
  );
}
