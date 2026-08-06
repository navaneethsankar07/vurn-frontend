import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/components/layouts/PublicLayout";
import SignupPage from "@/modules/public/auth/pages/SignUpPage";
import LoginPage from "@/modules/public/auth/pages/LoginPage";
import ForgotPasswordPage from "@/modules/public/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/modules/public/auth/pages/ResetPasswordPage";

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
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
];
