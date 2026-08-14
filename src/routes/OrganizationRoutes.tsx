import type { RouteObject } from "react-router-dom";
import { OrganizationLayout } from "@/layouts/OrganizationLayout";
import { ProtectedRoute } from "@/routes/guards/ProtectedRoute";
import { OrganizationDashboard } from "@/modules/user/organizations/pages/OrganizationDashboard";
import { getSubdomain } from "@/utils/subdomain";

const subdomain = getSubdomain();

export const OrganizationRoutes: RouteObject[] = subdomain
  ? [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <OrganizationLayout />,
            children: [
              {
                index: true,
                element: <OrganizationDashboard />,
              },
              {
                path: "projects",
                element: <h1>Projects List</h1>,
              },
              {
                path: "settings",
                element: <h1>Organization Settings</h1>,
              },
              {
                path: "members",
                element: <h1>Team Members</h1>,
              },
            ],
          },
        ],
      },
    ]
  : [];
