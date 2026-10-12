import { useQuery } from "@tanstack/react-query";
import { globalSearch, searchSuggestions } from "./searchApi";

export function useGlobalSearch(
  query: string,
  page: number = 1,
  pageSize: number = 20,
) {
  return useQuery({
    queryKey: ["global-search", query, page, pageSize],
    queryFn: () => globalSearch(query, page, pageSize),
    enabled: Boolean(query && query.trim().length >= 2),
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: () => searchSuggestions(query),
    enabled: Boolean(query && query.trim().length >= 2),
  });
}
