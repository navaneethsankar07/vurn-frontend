import api from "@/api/axios";
import type { GlobalSearchResponse } from "../types";

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
