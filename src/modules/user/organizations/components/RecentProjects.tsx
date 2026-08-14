import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { OrganizationProject } from "../types";

export function RecentProjects({
  projects,
}: {
  projects: OrganizationProject[];
}) {
  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent Projects
        </h3>
        <Link
          to="/projects"
          className="text-[11px] text-gray-500 hover:text-white transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between rounded border border-white/10 bg-[#09090b] p-3.5 hover:border-white/20 transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                  {project.code}
                </span>
                <span className="text-[10px] text-gray-500">
                  {project.updated_at}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{project.name}</h4>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-amber-500 transition-colors pt-2 border-t border-white/5"
            >
              <span>Open Project</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
