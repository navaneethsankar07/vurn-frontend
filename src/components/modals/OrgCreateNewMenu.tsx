import { useRef, useEffect } from "react";
import { FolderPlus, ShieldPlus, UserPlus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrgCreateNewMenuProps {
  onClose: () => void;
}

export function OrgCreateNewMenu({ onClose }: OrgCreateNewMenuProps) {
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

  const handleCreateOrganization = () => {
    onClose();
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : "";
    const rawBaseDomain = import.meta.env.VITE_APP_BASE_DOMAIN || "lvh.me";
    const cleanBaseDomain = rawBaseDomain.split(":")[0];
    window.location.href = `${protocol}//${cleanBaseDomain}${port}/organizations`;
  };

  return (
    <div
      ref={menuRef}
      className="w-72 sm:w-80 bg-[#09090B] border border-white/10 rounded-xs shadow-2xl font-mono text-white text-xs z-50 overflow-hidden"
    >
      <div className="px-3.5 py-3 border-b border-white/5 bg-black/60 space-y-0.5">
        <h3 className="font-bold uppercase tracking-wider text-[11px] text-white">
          Create New
        </h3>
        <p className="text-[11px] text-zinc-400 font-sans">
          Choose what you&apos;d like to create or add.
        </p>
      </div>

      <div className="p-2 space-y-1">
        <div
          onClick={() => {
            navigate("/projects/create");
            onClose();
          }}
          className="p-2.5 flex items-start gap-3 bg-white/3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group rounded-xs"
        >
          <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
            <FolderPlus className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-zinc-200 group-hover:text-white text-xs font-sans block">
              Project
            </span>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Create a new workspace project.
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            navigate("/roles?action=create");
            onClose();
          }}
          className="p-2.5 flex items-start gap-3 bg-white/3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group rounded-xs"
        >
          <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
            <ShieldPlus className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-zinc-200 group-hover:text-white text-xs font-sans block">
              Role
            </span>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Create a new security role.
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            navigate("/members?action=invite");
            onClose();
          }}
          className="p-2.5 flex items-start gap-3 bg-white/3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group rounded-xs"
        >
          <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
            <UserPlus className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-zinc-200 group-hover:text-white text-xs font-sans block">
              Invite Member
            </span>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Invite teammates to your organization.
            </p>
          </div>
        </div>

        <div
          onClick={handleCreateOrganization}
          className="p-2.5 flex items-start gap-3 bg-white/3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer group rounded-xs"
        >
          <div className="h-8 w-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-zinc-200 group-hover:text-white text-xs font-sans block">
              Organization
            </span>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Create a new team workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
