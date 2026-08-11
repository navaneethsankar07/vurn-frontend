import { APP_BASE_DOMAIN } from "@/modules/user/organizations/constants";

export function getOrganizationUrl(slug: string): string {
  const protocol = window.location.protocol;
  const cleanedSlug = slug.trim().toLowerCase();

  if (APP_BASE_DOMAIN.includes("localhost")) {
    const port = window.location.port ? `:${window.location.port}` : "";
    return `${protocol}//${cleanedSlug}.localhost${port}`;
  }

  return `${protocol}//${cleanedSlug}.${APP_BASE_DOMAIN}`;
}

export function formatSubdomainPreview(slug: string): string {
  const displaySlug = slug.trim().toLowerCase() || "acme-technologies";
  return `${displaySlug}.${APP_BASE_DOMAIN}`;
}