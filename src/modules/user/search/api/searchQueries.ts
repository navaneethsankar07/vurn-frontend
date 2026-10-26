import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { globalSearch, searchSuggestions } from "./searchApi";

export function useGlobalSearch(query: string, pageSize: number = 20) {
  return useInfiniteQuery({
    queryKey: ["global-search", query, pageSize],
    queryFn: ({ pageParam = 1 }) => globalSearch(query, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
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
