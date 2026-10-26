import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth,
  );

  const location = useLocation();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}