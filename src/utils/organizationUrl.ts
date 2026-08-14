import { APP_BASE_DOMAIN } from "@/modules/user/organizations/constants";

export function getOrganizationUrl(slug: string): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : "";
  const cleanedSlug = slug.trim().toLowerCase();

  // Strip any accidental port attached to APP_BASE_DOMAIN if present
  const baseDomainWithoutPort = APP_BASE_DOMAIN.split(":")[0];

  return `${protocol}//${cleanedSlug}.${baseDomainWithoutPort}${port}`;
}

export function formatSubdomainPreview(slug: string): string {
  const displaySlug = slug.trim().toLowerCase() || "acme-technologies";
  const baseDomainWithoutPort = APP_BASE_DOMAIN.split(":")[0];
  return `${displaySlug}.${baseDomainWithoutPort}`;
}
