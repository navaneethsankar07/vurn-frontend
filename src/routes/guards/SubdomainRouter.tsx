import { Outlet } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";

export function SubdomainRouter() {
  const subdomain = getSubdomain();

  if (subdomain) {
    return <Outlet />;
  }

  return <Outlet />;
}