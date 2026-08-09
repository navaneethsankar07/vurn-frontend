import { createBrowserRouter } from "react-router-dom";

import { PublicRoutes } from "@/routes/PublicRoutes";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";

export const router = createBrowserRouter([
  ...PublicRoutes,
  ...ProtectedRoutes,
]);

export default router;
