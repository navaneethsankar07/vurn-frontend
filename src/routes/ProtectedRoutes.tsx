import type { RouteObject } from "react-router-dom";
import { UserLayout } from "@/layouts/UserLayout";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import ProfilePage from "@/modules/user/account/pages/ProfilePage";
import GeneralSettingsPage from "@/modules/user/account/pages/GeneralSettingsPage";
import { SettingsLayout } from "@/modules/user/account/components/profile-settings/SettingsLayout";
import SecuritySettingsPage from "@/modules/user/account/pages/SecuritySettingsPage";
import DangerZonePage from "@/modules/user/account/pages/DangerZonePage";
import { CreateOrganizationPage } from "@/modules/user/organizations/pages/CreateOrganizationPage";
import { OrganizationsPage } from "@/modules/user/organizations/pages/OrganizationsPage";
import { OrganizationInvitationsPage } from "@/modules/user/organizations/pages/OrganizationInvitationsPage";
import { AcceptInvitationPage } from "@/modules/user/organizations/pages/AcceptInvitationPage";
import { GlobalSearchResultsPage } from "@/modules/user/search/components/GlobalSearchResultsPage";
import { KeyboardShortcutsPage } from "@/modules/public/docs/pages/KeyboardShortcutsPage";
import { HelpCenterPage } from "@/modules/public/docs/pages/HelpCenterPage";
import { DocumentationPage } from "@/modules/public/docs/pages/DocumentationPage";
import { HomePage } from "@/modules/user/dashboard/pages/HomePage";

export const ProtectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            path: "/search",
            element: <GlobalSearchResultsPage />,
          },
          {
            path: "/dashboard",
            element: <HomePage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/shortcuts",
            element: <KeyboardShortcutsPage />,
          },
          {
            path: "/organizations",
            element: <OrganizationsPage />,
          },
          {
            path: "/organizations/new",
            element: <CreateOrganizationPage />,
          },
          {
            path: "/invitations",
            element: <OrganizationInvitationsPage />,
          },
          {
            path: "/invitations/:token",
            element: <AcceptInvitationPage />,
          },
          {
            path: "help",
            element: <HelpCenterPage />,
          },
          {
            path: "documentation",
            element: <DocumentationPage />,
          },
          {
            element: <SettingsLayout />,
            children: [
              {
                path: "/settings/general",
                element: <GeneralSettingsPage />,
              },
              {
                path: "/settings/security",
                element: <SecuritySettingsPage />,
              },
              {
                path: "/settings/danger-zone",
                element: <DangerZonePage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
