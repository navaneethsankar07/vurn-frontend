import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/layouts/PublicLayout";

import { PublicOnlyRoute } from "./guards/PublicOnlyRoute";
import { passwordResetLoader } from "./guards/PasswordResetRoute";

import SignupPage from "@/modules/public/auth/pages/SignUpPage";
import LoginPage from "@/modules/public/auth/pages/LoginPage";
import ForgotPasswordPage from "@/modules/public/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/modules/public/auth/pages/ResetPasswordPage";
import { LandingPage } from "@/modules/public/landing/pages/LandingPage";

export const PublicRoutes: RouteObject[] = [
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage/>,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <SignupPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <PublicLayout />,
    children: [
      {
        path: "/reset-password",
        loader: passwordResetLoader,
        element: <ResetPasswordPage />,
      },
    ],
  },
];
