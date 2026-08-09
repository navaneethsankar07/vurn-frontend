import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "./guards/ProtectedRoute";
import { UserLayout } from "@/layouts/UserLayout";

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
        ],
      },
    ],
  },
];
