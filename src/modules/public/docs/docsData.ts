export interface DocTopicLink {
  label: string;
  href: string;
}

export interface DocTopicCard {
  title: string;
  iconName: string;
  links: DocTopicLink[];
}

export interface PopularArticle {
  title: string;
  href: string;
}

export interface KeyboardShortcutItem {
  action: string;
  keys: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const DOCS_SIDEBAR_LINKS = [
  "Getting Started",
  "Workspace",
  "Projects",
  "Issues",
  "Sprints",
  "Repository",
  "AI",
  "Organizations",
  "API",
  "Keyboard shortcuts",
];

export const DOCS_TOPIC_CARDS: DocTopicCard[] = [
  {
    title: "Getting Started",
    iconName: "Zap",
    links: [
      { label: "Account setup", href: "#" },
      { label: "Invite prompt", href: "#" },
      { label: "Create organization", href: "#" },
      { label: "Invite members", href: "#" },
    ],
  },
  {
    title: "Projects",
    iconName: "Folder",
    links: [
      { label: "Create project", href: "#" },
      { label: "Project settings", href: "#" },
      { label: "Members", href: "#" },
      { label: "Repository connection", href: "#" },
    ],
  },
  {
    title: "Issues",
    iconName: "AlertCircle",
    links: [
      { label: "Create issue", href: "#" },
      { label: "Issue policy", href: "#" },
      { label: "Labels", href: "#" },
      { label: "Comments", href: "#" },
      { label: "Attachments", href: "#" },
    ],
  },
  {
    title: "Sprints",
    iconName: "Kanban",
    links: [
      { label: "Create sprint", href: "#" },
      { label: "Planning", href: "#" },
      { label: "Progress", href: "#" },
      { label: "Sprint reports", href: "#" },
    ],
  },
  {
    title: "Repository",
    iconName: "GitBranch",
    links: [
      { label: "Connect GitHub", href: "#" },
      { label: "Commits", href: "#" },
      { label: "Pull requests", href: "#" },
      { label: "Automatic issue linking", href: "#" },
    ],
  },
  {
    title: "AI",
    iconName: "Sparkles",
    links: [
      { label: "AI credits", href: "#" },
      { label: "Task breakdown", href: "#" },
      { label: "Story point estimation", href: "#" },
      { label: "Duplicate detection", href: "#" },
      { label: "Sprint summary", href: "#" },
      { label: "Release notes", href: "#" },
    ],
  },
  {
    title: "Organizations",
    iconName: "Building2",
    links: [
      { label: "Members", href: "#" },
      { label: "Roles", href: "#" },
      { label: "Permissions", href: "#" },
      { label: "Settings", href: "#" },
    ],
  },
];

export const POPULAR_ARTICLES: PopularArticle[] = [
  { title: "How to connect GitHub", href: "#" },
  { title: "Managing organization members", href: "#" },
  { title: "Planning your first sprint", href: "#" },
  { title: "Using AI Credits", href: "#" },
  { title: "Creating your first issue", href: "#" },
];

export const KEYBOARD_SHORTCUTS: KeyboardShortcutItem[] = [
  { action: "Open quick search", keys: ["Ctrl", "K"] },
  { action: "Open keyboard shortcuts", keys: ["Ctrl", "J"] },
  { action: "Close dialog", keys: ["Esc"] },
  { action: "Submit comment", keys: ["Ctrl", "Enter"] },
  { action: "Open technical help", keys: ["?"] },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does GitHub integration work?",
    answer:
      "Vurn connects directly with your GitHub repositories via OAuth, allowing you to sync commits, pull requests, and issues seamlessly with your Vurn projects.",
  },
  {
    question: "How are AI Credits charged?",
    answer:
      "Every organization receives 100 free AI credits upon sign up. Credits are consumed when using AI-powered features like task breakdown, estimations, and sprint summaries.",
  },
  {
    question: "Can I transfer an organization? ",
    answer:
      "Yes, organization owners can transfer ownership to any other administrator member from the organization settings page.",
  },
  {
    question: "Can multiple projects connect to the same repository?",
    answer:
      "Yes, you can link a single GitHub repository to multiple projects within your organization to track contributions across different boards.",
  },
];
