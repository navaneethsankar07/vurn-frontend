import api from "@/api/axios";
import type { GlobalSearchResponse, SearchSuggestionsResponse } from "../types";

export async function globalSearch(
  query: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<GlobalSearchResponse> {
  const { data } = await api.get(
    `/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
  );
  return data;
}

export async function searchSuggestions(
  query: string,
): Promise<SearchSuggestionsResponse> {
  const { data } = await api.get(
    `/search/suggestions/?q=${encodeURIComponent(query)}`,
  );
  return data;
}
