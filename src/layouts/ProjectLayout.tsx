import { NavLink, Outlet, useParams } from "react-router-dom";
import { ProjectHeader } from "@/modules/user/projects/components/ProjectHeader";

const PROJECT_TABS = [
  { label: "Overview", path: "" },
  { label: "Board", path: "board" },
  { label: "Sprints", path: "sprints" },
  { label: "Issues", path: "issues" },
  { label: "Workflow", path: "workflow" },
  { label: "Repository", path: "repository" },
  { label: "Members", path: "members" },
  { label: "Settings", path: "settings" },
];

export function ProjectLayout() {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  return (
    <div className="bg-black text-white font-mono p-4 sm:p-6 lg:p-8">
      <div className="max-w-380 my-5 mx-auto space-y-6">
        {/* Isolated Header Component */}
        <ProjectHeader />

        {/* Project Secondary Navigation Tabs */}
        <div className="border-b border-white/10">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs font-medium">
            {PROJECT_TABS.map((tab) => {
              const fullPath = tab.path
                ? `/projects/${projectSlug}/${tab.path}`
                : `/projects/${projectSlug}`;
              return (
                <NavLink
                  key={tab.label}
                  to={fullPath}
                  end={tab.path === ""}
                  className={({ isActive }) =>
                    `pb-3 border-b-3 transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-primary text-text-primary font-semibold"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Child Tab Content */}
        <div className="pt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
