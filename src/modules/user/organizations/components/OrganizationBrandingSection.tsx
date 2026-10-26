import { renderOrgIcon } from "@/utils/renderOrgIcon";
import type { AccentColorOption } from "../types";

interface BrandingProps {
  orgName: string;
  selectedIcon: string;
  selectedColor: string;
  availableIcons: string[];
  availableColors: AccentColorOption[];
  onSelectIcon: (icon: string) => void;
  onSelectColor: (colorValue: string) => void;
}

export function OrganizationBrandingSection({
  orgName,
  selectedIcon,
  selectedColor,
  availableIcons,
  availableColors,
  onSelectIcon,
  onSelectColor,
}: BrandingProps) {
  return (
    <div className="space-y-6 pt-2 font-mono">
      <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#08080a] p-4 sm:p-5">
        <div
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg border transition-colors shrink-0"
          style={{
            borderColor: `${selectedColor}40`,
            backgroundColor: `${selectedColor}15`,
            color: selectedColor,
          }}
        >
          {renderOrgIcon(selectedIcon, { className: "h-7 w-7 sm:h-8 sm:w-8" })}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {orgName.trim() ? orgName : "Organization Name"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Live organization preview
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-300 block">
          Choose Icon
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {availableIcons.map((iconName) => {
            const isSelected = selectedIcon === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onSelectIcon(iconName)}
                className={`flex h-11 w-full items-center justify-center rounded-[3px] border transition-all ${
                  isSelected
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                    : "border-white/10 bg-[#09090b] text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {renderOrgIcon(iconName, { className: "h-5 w-5" })}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-300 block">
          Accent Color
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color.value;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color.value)}
                style={
                  isSelected
                    ? {
                        borderColor: `${color.value}60`,
                        backgroundColor: `${color.value}12`,
                        color: color.value,
                      }
                    : {}
                }
                className={`flex items-center justify-center rounded-[3px] border px-3 py-2.5 text-xs font-medium transition-all ${
                  isSelected
                    ? ""
                    : "border-white/10 bg-[#09090b] text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="capitalize truncate tracking-wide">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}