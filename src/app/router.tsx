import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "@/routes/PublicRoutes";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
import { OrganizationRoutes } from "@/routes/OrganizationRoutes";
import { SubdomainRouter } from "@/routes/guards/SubdomainRouter";

export const router = createBrowserRouter([
  {
    element: <SubdomainRouter />,
    children: [
      ...OrganizationRoutes,
      ...PublicRoutes,
      ...ProtectedRoutes,
    ],
  },
]);

export default router;