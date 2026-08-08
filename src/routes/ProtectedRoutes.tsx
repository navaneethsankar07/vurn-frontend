import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "./guards/ProtectedRoute";

export const ProtectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <h1>Dashboard</h1>,
      },
    ],
  },
];