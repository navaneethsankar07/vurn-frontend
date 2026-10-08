import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "@/routes/PublicRoutes";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
import { OrganizationRoutes } from "@/routes/OrganizationRoutes";
import { SubdomainRouter } from "@/routes/guards/SubdomainRouter";
import { GitHubCallbackPage } from "@/modules/user/integrations/github/pages/GitHubCallbackPage";

export const router = createBrowserRouter([
  {
    path: "/github/callback",
    element: <GitHubCallbackPage />,
  },
  {
    element: <SubdomainRouter />,
    children: [...OrganizationRoutes, ...PublicRoutes, ...ProtectedRoutes],
  },
]);

export default router;
