export interface HelpTopicSummary {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export interface HelpTopicDetail extends HelpTopicSummary {
  content: string;
}

export interface HelpTopicsListResponse {
  results: HelpTopicSummary[];
}

export interface HelpArticleSummary {
  slug: string;
  title: string;
  category: string;
  description: string;
  read_time_minutes: number;
}

export interface HelpArticleDetail extends HelpArticleSummary {
  content: string; 
}

export interface HelpArticlesListResponse {
  results: HelpArticleSummary[];
}
