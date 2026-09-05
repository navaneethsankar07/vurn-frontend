import { Outlet } from "react-router-dom";
import { ProjectSettingsHeader } from "@/modules/user/projects/components/settings/ProjectSettingsHeader";
import { ProjectSettingsSidebar } from "@/modules/user/projects/components/settings/ProjectSettingsSidebar";

export function ProjectSettingsLayout() {
  return (
    <div className="space-y-6 pt-2">
      <ProjectSettingsHeader />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProjectSettingsSidebar />

        {/* Main Settings Content Area */}
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
