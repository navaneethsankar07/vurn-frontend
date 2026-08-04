import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/components/layouts/PublicLayout";
import SignupPage from "@/modules/public/auth/pages/SignUpPage";

export const PublicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <h1>Landing Page</h1>,
      },
      {
        path: "/register",
        element: <SignupPage />,
      },
    ],
  },
];