import type { RouteObject } from "react-router-dom";
import { OrganizationLayout } from "@/layouts/OrganizationLayout";
import { ProtectedRoute } from "@/routes/guards/ProtectedRoute";
import { OrganizationDashboard } from "@/modules/user/organizations/pages/OrganizationDashboard";
import { getSubdomain } from "@/utils/subdomain";
import { GeneralSettingsPage } from "@/modules/user/organizations/pages/GeneralSettingsPage";
import { SettingsLayout } from "@/modules/user/organizations/layout/SettingsLayout";
import { BrandingSettingsPage } from "@/modules/user/organizations/pages/BrandingSettingsPage";
import { DangerZonePage } from "@/modules/user/organizations/pages/DangerZonePage";
import { IntegrationsSettingsPage } from "@/modules/user/organizations/pages/IntegrationsSettingsPage";
import { BillingSettingsPage } from "@/modules/user/organizations/pages/BillingSettingsPage";
import { OrganizationPreferencesPage } from "@/modules/user/organizations/pages/OrganizationPreferencesPage";
import { OrganizationRolesPage } from "@/modules/user/organizations/pages/OrganizationRolesPage";
import { OrganizationMembersPage } from "@/modules/user/organizations/pages/OrganizationMembersPage";

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
                element: <SettingsLayout />,
                children: [
                  {
                    path: "general",
                    element: <GeneralSettingsPage />,
                  },
                  {
                    path: "branding",
                    element: <BrandingSettingsPage />,
                  },
                  {
                    path: "preferences",
                    element: <OrganizationPreferencesPage />,
                  },
                  {
                    path: "integrations",
                    element: <IntegrationsSettingsPage />,
                  },
                  {
                    path: "billing",
                    element: <BillingSettingsPage />,
                  },
                  {
                    path: "danger-zone",
                    element: <DangerZonePage />,
                  },
                ],
              },
              {
                path: "members",
                element: <OrganizationMembersPage/>,
              },
              {
                path: "roles",
                element: <OrganizationRolesPage/>,
              },
            ],
          },
        ],
      },
    ]
  : [];
