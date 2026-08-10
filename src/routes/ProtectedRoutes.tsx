import type { RouteObject } from "react-router-dom";

import { UserLayout } from "@/layouts/UserLayout";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import ProfilePage from "@/modules/user/account/pages/ProfilePage";
import GeneralSettingsPage from "@/modules/user/account/pages/GeneralSettingsPage";
import { SettingsLayout } from "@/modules/user/account/components/SettingsLayout";

export const ProtectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            path: "/dashboard",
            element: <h1>Dashboard</h1>,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            element: <SettingsLayout />,
            children: [
              {
                path: "/settings/general",
                element: <GeneralSettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
