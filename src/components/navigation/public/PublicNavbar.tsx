import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "/docs" },
];
export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-backdrop-filter:bg-black/60 font-mono">
      <div className="mx-30 flex h-18 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link
          to="/"
          className="flex gap-2 shrink-0 h-16 overflow-hidden items-center justify-center"
        >
          <span className="flex items-center justify-center overflow-hidden h-full">
            <object
              data={logo}
              type="image/svg+xml"
              className="w-28 sm:w-32 pointer-events-none"
            />
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-10">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `text-xs transition-colors hover:text-white ${
                  isActive ? "text-white font-medium" : "text-gray-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-xs text-gray-200 hover:bg-white/5 hover:text-white cursor-pointer h-9 px-4 rounded-xs"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="bg-primary text-xs rounded-xs font-semibold text-black hover:bg-primary/90 cursor-pointer h-9 px-4"
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-white/10 text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:hidden cursor-pointer"
        >
          <span className="sr-only">
            {mobileMenuOpen ? "Close menu" : "Open menu"}
          </span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-black/95 px-4 pt-4 pb-6 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-4 py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-white ${
                    isActive ? "text-primary" : "text-gray-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full justify-center text-xs text-gray-200 hover:bg-white/5 hover:text-white rounded-xs"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/register");
              }}
              className="w-full justify-center bg-primary text-xs font-semibold text-black hover:bg-primary/90 rounded-xs"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
