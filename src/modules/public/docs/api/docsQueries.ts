import { useQuery } from "@tanstack/react-query";
import {
  fetchFaqs,
  fetchHelpArticleDetail,
  fetchHelpArticles,
  fetchHelpTopicDetail,
  fetchHelpTopics,
} from "./docsApi";

export function useHelpTopics(searchQuery?: string, limit?: number) {
  return useQuery({
    queryKey: ["help-topics", searchQuery, limit],
    queryFn: () => fetchHelpTopics(searchQuery, limit),
  });
}

export function useHelpTopicDetail(slug: string | null) {
  return useQuery({
    queryKey: ["help-topic-detail", slug],
    queryFn: () => fetchHelpTopicDetail(slug!),
    enabled: Boolean(slug),
  });
}

export function useHelpArticles(searchQuery?: string, category?: string) {
  return useQuery({
    queryKey: ["help-articles", searchQuery, category],
    queryFn: () => fetchHelpArticles(searchQuery, category),
  });
}

export function useHelpArticleDetail(slug: string | null) {
  return useQuery({
    queryKey: ["help-article-detail", slug],
    queryFn: () => fetchHelpArticleDetail(slug!),
    enabled: Boolean(slug),
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["help-faqs"],
    queryFn: fetchFaqs,
  });
}
