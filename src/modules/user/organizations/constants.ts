import type { OrganizationQueryParams } from "./types";

export const DEFAULT_ORGANIZATION_ICON = "hexagon";
export const DEFAULT_ORGANIZATION_COLOR = "#F59E0B";

export const APP_BASE_DOMAIN =
  import.meta.env.VITE_APP_BASE_DOMAIN || "vurn.co";

export const ITEMS_PER_PAGE = 5;

export const DEFAULT_ORGANIZATION_QUERY_PARAMS: OrganizationQueryParams = {
  page: 1,
  page_size: ITEMS_PER_PAGE,
  sort_by: "recent",
  order: "desc",
};