import { Outlet } from "react-router-dom";
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsSidebar } from "../components/settings/SettingsSidebar";

export function SettingsLayout() {
  return (
    <div className="w-full max-w-7xl min-h-screen space-y-6 sm:space-y-0 font-mono p-4 sm:p-6 lg:p-0">
      <SettingsHeader />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start">
        <SettingsSidebar />
        <main className="flex-1 min-w-0 w-full lg:pt-6 lg:pr-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
