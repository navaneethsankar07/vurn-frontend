import { Outlet } from "react-router-dom";
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsSidebar } from "../components/settings/SettingsSidebar";

export function SettingsLayout() {
  return (
    <div className="w-full max-w-8xl h-full flex flex-col font-mono p-4 sm:p-6 lg:p-0 overflow-hidden">
      <SettingsHeader />

      <div className="flex flex-1 flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start min-h-0 overflow-hidden">
        <SettingsSidebar />
        <main className="flex-1 min-w-0 w-full h-full overflow-y-auto lg:pt-6 lg:pr-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}