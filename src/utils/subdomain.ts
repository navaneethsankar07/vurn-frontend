export function getSubdomain(): string | null {
  const hostname = window.location.hostname; // e.g., "my-org.lvh.me" or "lvh.me"

  if (
    hostname === "localhost" ||
    hostname === "lvh.me" ||
    hostname === "127.0.0.1"
  ) {
    return null;
  }

  const parts = hostname.split(".");

  if (parts.length > 2) {
    return parts[0].toLowerCase().trim();
  }

  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0].toLowerCase().trim();
  }

  return null;
}
