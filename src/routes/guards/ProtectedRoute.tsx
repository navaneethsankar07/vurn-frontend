import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth,
  );

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="font-mono text-sm text-gray-500">Loading...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
