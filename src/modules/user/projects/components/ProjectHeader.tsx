import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Archive, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubdomain } from "@/utils/subdomain";
import { useProjectDashboard } from "../api/projectQueries";

export function ProjectHeader() {
  const navigate = useNavigate();
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const { data: project } = useProjectDashboard(subdomain, projectSlug || "");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 font-mono">
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
          <Folder className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {project?.name || "Project Overview"}
            </h1>
            {project?.key && (
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
                {project.key}
              </span>
            )}
            {project?.status && (
              <span className="px-2 py-0.5 text-[10px] rounded-xs capitalize border border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10">
                • {project.status}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed font-sans">
            {project?.description ||
              "Manage project resources, tasks, and documentation."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Button
          variant="outline"
          onClick={() => navigate(`/projects/${projectSlug}/settings`)}
          className="h-9 gap-1.5 border-white/10 bg-[#0C0C0E] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Project
        </Button>
        <Button
          variant="outline"
          className="h-9 gap-1.5 border-white/10 bg-[#0C0C0E] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
        >
          <Archive className="h-3.5 w-3.5" />
          Archive Project
        </Button>
        <Button
          onClick={() => navigate(`/projects/${projectSlug}/issues`)}
          className="h-9 gap-1.5 bg-transparent border border-primary text-primary hover:bg-transparent hover:border-primary/60 hover:text-primary/70 font-semibold text-xs rounded transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Issue
        </Button>
      </div>
    </div>
  );
}
