import { Outlet } from "react-router-dom";
import { OrganizationNavbar } from "@/components/navigation/organization/OrganizationNavbar";
import { OrganizationSidebar } from "@/components/navigation/organization/OrganizationSidebar";

interface OrganizationLayoutProps {
  slug?: string;
}

export function OrganizationLayout({ slug }: OrganizationLayoutProps) {
  return (
    <div className="h-screen w-full bg-[#030303] text-white flex flex-col font-mono selection:bg-amber-500 selection:text-black overflow-hidden">
      <OrganizationNavbar currentOrgName={slug || "Acme Labs"} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <OrganizationSidebar />
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
