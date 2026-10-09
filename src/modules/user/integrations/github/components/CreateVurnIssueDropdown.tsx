import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCreateProjectIssue } from "@/modules/user/issues/api/issueMutations";
import { getSubdomain } from "@/utils/subdomain";
import { useParams } from "react-router-dom";
import type { GitHubIssueItem } from "../types";

interface CreateVurnIssueDropdownProps {
  issue: GitHubIssueItem;
}

const WORK_ITEM_TYPES = [
  { label: "Epic", value: "epic" },
  { label: "Story", value: "story" },
  { label: "Task", value: "task" },
  { label: "Bug", value: "bug" },
] as const;

export function CreateVurnIssueDropdown({
  issue,
}: CreateVurnIssueDropdownProps) {
  const subdomain = getSubdomain() || "";
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [createdType, setCreatedType] = useState<string | null>(null);

  const { mutate: createIssue, isPending } = useCreateProjectIssue();

  const handleCreate = (issueType: any) => {
    if (!projectSlug) return;

    createIssue(
      {
        subdomain,
        projectSlug,
        data: {
          issue_type: issueType,
          title: issue.title,
          description:
            issue.description ||
            `Imported from GitHub Issue #${issue.issue_number}\n\n${issue.url}`,
          priority: "medium",
        },
      },
      {
        onSuccess: () => {
          setCreatedType(issueType);
        },
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center">
        <Button
          type="button"
          disabled={isPending || createdType !== null}
          className="h-8 gap-1.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs cursor-pointer px-3 pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : createdType ? (
            <Check className="h-3.5 w-3.5 stroke-3" />
          ) : (
            <Plus className="h-3.5 w-3.5 stroke-3" />
          )}
          <span>
            {createdType ? `Created as ${createdType}` : "Create Work Item"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      {!createdType && (
        <DropdownMenuContent
          align="end"
          className="bg-[#09090B] border border-white/10 text-white font-mono rounded-xs p-1 shadow-2xl w-36"
        >
          {WORK_ITEM_TYPES.map((type) => (
            <DropdownMenuItem
              key={type.value}
              onClick={() => handleCreate(type.value)}
              className="text-xs text-zinc-300 focus:text-white focus:bg-amber-500/10 rounded-xs cursor-pointer px-2.5 py-1.5 uppercase font-medium"
            >
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
