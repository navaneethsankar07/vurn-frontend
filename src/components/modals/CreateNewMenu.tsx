import { useRef, useEffect } from "react";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateNewMenuProps {
  onClose: () => void;
}

export function CreateNewMenu({ onClose }: CreateNewMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="w-72 sm:w-60 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl font-mono text-white text-xs z-50 overflow-hidden"
    >
      <div className="px-3.5 py-3 border-b border-white/5 bg-black/60 space-y-0.5">
        <h3 className="font-bold uppercase tracking-wider text-[11px] text-white">
          Create New
        </h3>
        <p className="text-[11px] text-zinc-400 font-sans">
          Choose what you&apos;d like to create.
        </p>
      </div>

      <div className="p-2">
        <div
          onClick={() => {
            navigate("/organizations/new");
            onClose();
          }}
          className="p-2.5 flex items-start gap-3 bg-white/3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group rounded-xs"
        >
          <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-zinc-200 group-hover:text-white text-xs font-sans block">
              Organization
            </span>
            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
              Create a new workspace for your team.
            </p>
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2.5 border-t border-white/5 bg-black/60">
        <p className="text-[10px] text-zinc-500 font-sans italic leading-normal">
          Projects, sprints, and issues can be created inside an organization.
        </p>
      </div>
    </div>
  );
}
