import { Outlet } from "react-router-dom";
import { ProjectSettingsHeader } from "@/modules/user/projects/components/settings/ProjectSettingsHeader";
import { ProjectSettingsSidebar } from "@/modules/user/projects/components/settings/ProjectSettingsSidebar";

export function ProjectSettingsLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden pt-2">
      <div className="shrink-0">
        <ProjectSettingsHeader />
      </div>

      <div className="flex flex-1 flex-col md:flex-row gap-50 items-start overflow-hidden min-h-0">
        <div className="shrink-0 pt-5">
          <ProjectSettingsSidebar />
        </div>

        <main className="flex-1 w-full min-w-0 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
