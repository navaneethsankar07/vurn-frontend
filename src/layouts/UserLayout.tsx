import { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserNavbar } from "@/components/navigation/user/UserNavbar";
import { UserSidebar } from "@/components/navigation/user/UserSidebar";

export function UserLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#030303] text-white selection:text-black">
      <UserNavbar onCollapseToggle={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed}/>

      <div className="flex flex-1 overflow-hidden">
        <UserSidebar isCollapsed={isSidebarCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}