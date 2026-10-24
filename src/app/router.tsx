import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "@/routes/PublicRoutes";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
import { OrganizationRoutes } from "@/routes/OrganizationRoutes";
import { SubdomainRouter } from "@/routes/guards/SubdomainRouter";
import { GitHubCallbackPage } from "@/modules/user/integrations/github/pages/GitHubCallbackPage";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { NotFoundPage } from "@/components/common/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/github/callback",
    element: <GitHubCallbackPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <SubdomainRouter />,
    errorElement: <ErrorBoundary />,
    children: [...OrganizationRoutes, ...PublicRoutes, ...ProtectedRoutes],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;
