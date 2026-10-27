export function getSubdomain(): string | null {
  const hostname = window.location.hostname.toLowerCase();

  const baseDomain = (import.meta.env.VITE_APP_BASE_DOMAIN || "vurn.co.in")
    .split(":")[0]
    .toLowerCase();

  if (
    hostname === baseDomain ||
    hostname === `www.${baseDomain}` ||
    hostname === "localhost" ||
    hostname === "lvh.me" ||
    hostname === "127.0.0.1"
  ) {
    return null;
  }

  if (hostname.endsWith(".localhost")) {
    return hostname.replace(".localhost", "").trim() || null;
  }

  if (hostname.endsWith(`.${baseDomain}`)) {
    const sub = hostname.slice(0, -(baseDomain.length + 1)).trim();
    if (sub === "www" || sub === "api") {
      return null;
    }
    return sub || null;
  }

  return null;
}

export function getOrganizationUrl(
  organizationSlug: string,
  path: string = "",
) {
  const rawBaseDomain = import.meta.env.VITE_APP_BASE_DOMAIN || "vurn.co.in";
  const port = window.location.port ? `:${window.location.port}` : "";
  const cleanBase = rawBaseDomain.split(":")[0];

  return `${window.location.protocol}//${organizationSlug}.${cleanBase}${port}${path}`;
}
