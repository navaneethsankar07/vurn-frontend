import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { OrganizationNavbar } from "@/components/navigation/organization/OrganizationNavbar";
import { OrganizationSidebar } from "@/components/navigation/organization/OrganizationSidebar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getCurrentUser } from "@/modules/public/auth/api/authApi";

interface OrganizationLayoutProps {
  slug?: string;
}

export function OrganizationLayout({ slug }: OrganizationLayoutProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If Redux state is empty on subdomain mount, re-fetch user profile
    if (!user) {
      dispatch(getCurrentUser);
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-mono selection:bg-amber-500 selection:text-black">
      <OrganizationNavbar currentOrgName={slug || "Acme Labs"} />

      <div className="flex flex-1">
        <OrganizationSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}