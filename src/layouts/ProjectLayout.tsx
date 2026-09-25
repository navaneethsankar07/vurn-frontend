import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import { ProjectHeader } from "@/modules/user/projects/components/ProjectHeader";
import { IssueDetailPanel } from "@/modules/user/issues/components/IssueDetailPanel";
import { getSubdomain } from "@/utils/subdomain";

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
  const { projectSlug = "" } = useParams<{ projectSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subdomain = getSubdomain() || "";

  const selectedIssueId = searchParams.get("selectedIssue");

  const [panelWidth, setPanelWidth] = useState(480);
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleClosePanel = () => {
    searchParams.delete("selectedIssue");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="bg-black text-white font-mono h-full flex overflow-hidden">
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
        <div className="max-w-380 my-5 mx-auto space-y-6 w-full flex flex-col flex-1 min-h-0">
          <div className="shrink-0 space-y-6">
            <ProjectHeader />

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
          </div>

          <div className="pt-2 flex-1 min-h-0 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {selectedIssueId && (
        <div
          className="relative flex shrink-0 h-full border-l border-white/10"
          style={{ width: `${panelWidth}px` }}
        >
          <div
            onMouseDown={handleMouseDown}
            className="w-1.5 h-full cursor-col-resize hover:bg-amber-500/40 active:bg-amber-500 transition-colors z-30 -ml-1 absolute left-0 top-0 bottom-0"
          />
          <div className="flex-1 h-full min-w-0">
            <IssueDetailPanel
              subdomain={subdomain}
              projectSlug={projectSlug}
              issueId={selectedIssueId}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
