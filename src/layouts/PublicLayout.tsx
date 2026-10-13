import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/navigation/public/PublicNavbar";
import { SiteFooter } from "@/components/navigation/public/PublicFooter";

export function PublicLayout() {
  return (
    <div className="flex h-screen flex-col bg-black text-white selection:bg-amber-500 selection:text-black overflow-hidden">
      <SiteHeader />

      <main className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
