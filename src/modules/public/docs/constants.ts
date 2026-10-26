export interface ShortcutItem {
  keyDisplay: string[];
  title: string;
  description: string;
}

export interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutItem[];
}

export const KEYBOARD_SHORTCUTS: ShortcutCategory[] = [
  {
    category: "Global",
    shortcuts: [
      {
        keyDisplay: ["Ctrl", "K"],
        title: "Open Global Search",
        description:
          "Search projects, issues, documents, organizations and members.",
      },
      {
        keyDisplay: ["N"],
        title: "Open New Menu",
        description: "Open the global new menu from anywhere in Vurn.",
      },
      {
        keyDisplay: ["Shift", "N"],
        title: "Open Notifications",
        description: "View your recent notifications and updates.",
      },
      {
        keyDisplay: ["Esc"],
        title: "Close Dialog",
        description: "Close the currently open modal, drawer or dropdown.",
      },
    ],
  },
  {
    category: "Navigation",
    shortcuts: [
      {
        keyDisplay: ["G", "P"],
        title: "Go to Projects",
        description: "Navigate directly to your organization projects.",
      },
      {
        keyDisplay: ["G", "O"],
        title: "Go to Organizations",
        description: "Open the organizations workspace overview.",
      },
      {
        keyDisplay: ["G", "D"],
        title: "Go to Docs",
        description: "Open project documentation.",
      },
      {
        keyDisplay: ["G", "H"],
        title: "Go to Home",
        description: "Return to your personal workspace home.",
      },
    ],
  },
  {
    category: "Issue Management",
    shortcuts: [
      {
        keyDisplay: ["C", "I"],
        title: "Create Issue",
        description: "Open the Create Issue flow for the current workspace.",
      },
      {
        keyDisplay: ["Ctrl", "Enter"],
        title: "Submit Comment",
        description: "Post your comment on the active issue or discussion.",
      },
    ],
  },
  {
    category: "Repository",
    shortcuts: [
      {
        keyDisplay: ["R"],
        title: "Refresh Repository",
        description:
          "Refresh repository data, commits and pull request status.",
      },
    ],
  },
];
