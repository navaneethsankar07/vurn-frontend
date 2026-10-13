import api from "@/api/axios";
import type { HelpTopicsListResponse, HelpTopicDetail } from "../types";

export async function fetchHelpTopics(
  searchQuery?: string,
): Promise<HelpTopicsListResponse> {
  const url = searchQuery
    ? `/help/topics/?q=${encodeURIComponent(searchQuery)}`
    : "/help/topics/";
  const response = await api.get(url);
  return response.data;
}

export async function fetchHelpTopicDetail(
  slug: string,
): Promise<HelpTopicDetail> {
  const response = await api.get(`/help/topics/${slug}/`);
  return response.data;
}
