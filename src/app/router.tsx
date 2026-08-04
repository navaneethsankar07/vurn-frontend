import { createBrowserRouter } from "react-router-dom";

import { PublicRoutes } from "@/routes/PublicRoutes";

export const router = createBrowserRouter([
  ...PublicRoutes,
]);

export default router;