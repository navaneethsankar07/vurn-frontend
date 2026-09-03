import { useNavigate } from "react-router-dom";
import { Plus, Folder, Hexagon, Code2, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";

const DUMMY_PROJECTS = [
  {
    id: 1,
    name: "Vurn Backend",
    key: "VRN",
    description: "Backend development project",
    icon: "hexagon",
    accent_color: "#F59E0B",
    status: "active",
    start_date: "2026-09-02",
    target_date: "2026-12-31",
  },
  {
    id: 2,
    name: "Dev-Link Frontend",
    key: "DLK",
    description: "Real-time developer collaboration application interface.",
    icon: "code-2",
    accent_color: "#3B82F6",
    status: "active",
    start_date: "2026-08-15",
    target_date: "2026-11-20",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  hexagon: Hexagon,
  "briefcase-business": BriefcaseBusiness,
  "code-2": Code2,
};

export function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
            <p className="text-xs text-gray-400 mt-1">
              Overview of organization projects and performance targets.
            </p>
          </div>
          <Button
            onClick={() => navigate("/projects/create")}
            className="h-10 gap-2 bg-transparent border border-primary/80 text-primary hover:text-primary/70 hover:border-primary/60 hover:bg-transparent font-semibold text-xs rounded-sm w-full sm:w-auto transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DUMMY_PROJECTS.map((project) => {
            const IconComponent = ICON_MAP[project.icon] || Folder;
            return (
              <div
                key={project.id}
                className="border border-white/10 rounded-sm bg-[#0C0C0E] p-5 space-y-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-sm flex items-center justify-center border border-white/10"
                      style={{
                        backgroundColor: `${project.accent_color}15`,
                        color: project.accent_color,
                      }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{project.name}</h3>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                        KEY: {project.key}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] rounded-sm capitalize">
                    {project.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2">
                  {project.description || "No description provided."}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Start: {project.start_date || "—"}</span>
                  <span>Target: {project.target_date || "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
