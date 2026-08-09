import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
        <p className="font-mono">
          © 2026 Vurn. Built for modern engineering teams.
        </p>
        <div className="flex items-center gap-10 font-mono">
          <Link to="#privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <Link to="#terms" className="transition-colors hover:text-white">
            Terms
          </Link>
          <Link to="#status" className="transition-colors hover:text-white">
            Status
          </Link>
        </div>
      </div>
    </footer>
  );
}
