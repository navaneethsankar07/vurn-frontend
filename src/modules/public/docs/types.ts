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
