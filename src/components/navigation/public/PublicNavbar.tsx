import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";

// ---------------------------------------------------------------------------
// PLACEHOLDER DATA — swap for real nav config as needed.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "#docs" },
  { label: "GitHub", href: "#github" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {/* PLACEHOLDER: replace with actual logo mark */}
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-black">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Vurn</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-white ${
                  isActive ? "text-white font-medium" : "text-gray-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-200 hover:bg-white/5 hover:text-white"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="bg-primary text-sm rounded-sm font-semibold text-black hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile menu trigger — PLACEHOLDER: wire up a Sheet/Drawer here */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
        >
          <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-black/95 px-4 pt-2 pb-6 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-4 py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors hover:text-white ${
                    isActive ? "text-primary" : "text-gray-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full justify-center text-sm text-gray-200 hover:bg-white/5 hover:text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/get-started");
              }}
              className="w-full justify-center bg-primary text-sm font-semibold text-black hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}