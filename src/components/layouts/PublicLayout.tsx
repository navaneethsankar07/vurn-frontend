import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/navigation/public/PublicNavbar";
import { SiteFooter } from "@/components/navigation/public/PublicFooter";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-amber-500 selection:text-black">
      {/* Sticky Header */}
      <SiteHeader />

      {/* Dynamic Route Content */}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}