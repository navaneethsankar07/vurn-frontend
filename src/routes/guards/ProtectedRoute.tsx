import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { getSubdomain } from "@/utils/subdomain";
import { APP_BASE_DOMAIN } from "@/modules/user/organizations/constants";

export function ProtectedRoute() {
  const location = useLocation();
  const { user, isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth,
  );

  const subdomain = getSubdomain();

  console.log("[ProtectedRoute Render]", {
    pathname: location.pathname,
    subdomain,
    isInitializing,
    isAuthenticated,
    user,
    userOrganizations: user?.organizations,
  });

  const buildRootUrl = (path: string) => {
    const protocol = window.location.protocol;
    const cleanBaseDomain = APP_BASE_DOMAIN.replace(/:\d+$/, "").replace(/\/$/, "");
    const port = window.location.port ? `:${window.location.port}` : "";

    return `${protocol}//${cleanBaseDomain}${port}${path}`;
  };

  useEffect(() => {
    console.log("[ProtectedRoute useEffect trigger]", {
      isInitializing,
      isAuthenticated,
      hasUser: !!user,
      subdomain,
    });

    if (isInitializing) {
      console.log("[ProtectedRoute Effect] Still initializing, skipping redirect checks.");
      return;
    }

    if (!isAuthenticated || !user) {
      console.warn("[ProtectedRoute Effect] User is not authenticated or user object missing.");
      if (subdomain) {
        const rootLoginUrl = buildRootUrl("/login");
        const returnUrl = encodeURIComponent(window.location.href);
        const targetUrl = `${rootLoginUrl}?redirect=${returnUrl}`;
        console.warn("[ProtectedRoute Effect] Redirecting unauthenticated subdomain request to:", targetUrl);
        window.location.href = targetUrl;
      }
      return;
    }

    if (subdomain) {
      const userOrgs = user.organizations || [];
      const hasOrgAccess = userOrgs.some(
        (org) => org.slug.toLowerCase() === subdomain.toLowerCase(),
      );

      if (!hasOrgAccess) {
        const targetDashboardUrl = buildRootUrl("/dashboard");
        
        window.location.href = targetDashboardUrl;
      }
    }
  }, [isInitializing, isAuthenticated, user, subdomain]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="font-mono text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (subdomain) {
      return null;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (subdomain) {
    const userOrgs = user.organizations || [];
    const hasOrgAccess = userOrgs.some(
      (org) => org.slug.toLowerCase() === subdomain.toLowerCase(),
    );

    if (!hasOrgAccess) {
      return null;
    }
  }

  return <Outlet />;
}