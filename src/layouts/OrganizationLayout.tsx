import { Outlet } from "react-router-dom";
import { OrganizationNavbar } from "@/components/navigation/organization/OrganizationNavbar";
import { OrganizationSidebar } from "@/components/navigation/organization/OrganizationSidebar";

interface OrganizationLayoutProps {
  slug?: string;
}

export function OrganizationLayout({ slug }: OrganizationLayoutProps) {

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-mono selection:bg-amber-500 selection:text-black">
      <OrganizationNavbar currentOrgName={slug || "Acme Labs"} />

      <div className="flex flex-1">
        <OrganizationSidebar />
        <main className="flex-1 p-6 lg:p-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}