export function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function formatKey(key: string): string {
  if (key === "Ctrl") {
    return isMac() ? "⌘" : "Ctrl";
  }
  return key;
}
