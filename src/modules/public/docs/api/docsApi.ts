import api from "@/api/axios";
import type {
  HelpTopicsListResponse,
  HelpTopicDetail,
  HelpArticlesListResponse,
  HelpArticleDetail,
  FaqListResponse,
} from "../types";

export async function fetchHelpTopics(
  searchQuery?: string,
  limit?: number,
): Promise<HelpTopicsListResponse> {
  const params = new URLSearchParams();
  if (searchQuery) params.append("q", searchQuery);
  if (limit) params.append("limit", String(limit));

  const queryString = params.toString();
  const url = queryString ? `/help/topics/?${queryString}` : "/help/topics/";
  const response = await api.get(url);
  return response.data;
}

export async function fetchHelpTopicDetail(
  slug: string,
): Promise<HelpTopicDetail> {
  const response = await api.get(`/help/topics/${slug}/`);
  return response.data;
}

export async function fetchHelpArticles(
  searchQuery?: string,
  category?: string,
): Promise<HelpArticlesListResponse> {
  const params = new URLSearchParams();
  if (searchQuery) params.append("q", searchQuery);
  if (category && category !== "all") params.append("category", category);

  const queryString = params.toString();
  const url = queryString
    ? `/help/articles/?${queryString}`
    : "/help/articles/";
  const response = await api.get(url);
  return response.data;
}

export async function fetchHelpArticleDetail(
  slug: string,
): Promise<HelpArticleDetail> {
  const response = await api.get(`/help/articles/${slug}/`);
  return response.data;
}

export async function fetchFaqs(): Promise<FaqListResponse> {
  const response = await api.get("/help/faqs/");
  return response.data;
}
