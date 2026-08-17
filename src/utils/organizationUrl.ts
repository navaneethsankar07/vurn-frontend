import { APP_BASE_DOMAIN } from "@/modules/user/organizations/constants";

export function getOrganizationUrl(slug: string, path: string = ""): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : "";
  const cleanedSlug = slug.trim().toLowerCase();

  const baseDomainWithoutPort = APP_BASE_DOMAIN.split(":")[0];

  const formattedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  return `${protocol}//${cleanedSlug}.${baseDomainWithoutPort}${port}${formattedPath}`;
}

export function formatSubdomainPreview(slug: string): string {
  const displaySlug = slug.trim().toLowerCase() || "acme-technologies";
  const baseDomainWithoutPort = APP_BASE_DOMAIN.split(":")[0];
  return `${displaySlug}.${baseDomainWithoutPort}`;
}
