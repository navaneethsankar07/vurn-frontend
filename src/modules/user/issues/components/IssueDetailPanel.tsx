import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useProjectIssueDetail, useProjectEpics } from "../api/issueQueries";
import { useProjectWorkflow } from "../../projects/api/projectQueries";
import { useBoardSprints } from "../../sprints/api/sprintQueries";
import { useProjectMembers } from "../../projects/api/projectQueries";
import { useLabelSuggestions } from "../api/issueQueries";
import {
  useUpdateProjectIssue,
  useAddIssueLabel,
  useRemoveIssueLabel,
  useDeleteProjectIssue,
} from "../api/issueMutations";

import { IssueDetailHeader } from "./IssueDetailHeader";
import { IssueInfoCard } from "./IssueInfoCard";
import { IssueLabelsCard } from "./IssueLabelsCard";
import { IssueSubtasksSection } from "./IssueSubtasksSection";
import { IssueCommentsSection } from "./IssueCommentsSection";
import { DeleteIssueConfirmationModal } from "./modals/DeleteIssueConfirmModal";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import type { WorkItemPriority, IssueLabel, IssueItem } from "../types";
import { IssueAttachmentsSection } from "./IssueAttachmentsSection";

interface IssueDetailPanelProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
  onClose: () => void;
}

export function IssueDetailPanel({
  subdomain,
  projectSlug,
  issueId: initialIssueId,
  onClose,
}: IssueDetailPanelProps) {
  const [, setSearchParams] = useSearchParams();

  const [currentIssueId, setCurrentIssueId] = useState<number | string>(
    initialIssueId,
  );
  const [historyStack, setHistoryStack] = useState<(number | string)[]>([]);

  useEffect(() => {
    setCurrentIssueId(initialIssueId);
  }, [initialIssueId]);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState("");
  const [pointsEditLocation, setPointsEditLocation] = useState<
    "header" | "info" | null
  >(null);
  const [pointsInput, setPointsInput] = useState("");

  const [isEditingEstimateHours, setIsEditingEstimateHours] = useState(false);
  const [estimateHoursInput, setEstimateHoursInput] = useState("");

  const [labelSearch, setLabelSearch] = useState("");
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: issue,
    isLoading,
    isError,
  } = useProjectIssueDetail(subdomain, projectSlug, currentIssueId);

  const { data: workflowData } = useProjectWorkflow(subdomain, projectSlug);
  const { data: boardSprints = [] } = useBoardSprints(subdomain, projectSlug);
  const { data: membersResponse } = useProjectMembers(subdomain, projectSlug);
  const { data: epicsData } = useProjectEpics(subdomain, projectSlug);
  const { data: labelSuggestions = [] } = useLabelSuggestions(
    subdomain,
    projectSlug,
    { search: labelSearch },
  );

  const { mutate: updateIssue } = useUpdateProjectIssue();
  const { mutate: addLabel, isPending: isAddingLabel } = useAddIssueLabel();
  const { mutate: removeLabel } = useRemoveIssueLabel();
  const { mutate: deleteIssue, isPending: isDeletingIssue } =
    useDeleteProjectIssue();

  const statuses = workflowData?.statuses || [];
  const members = membersResponse?.results || [];
  const epics = epicsData?.results || [];

  useEffect(() => {
    if (issue) {
      setTitleInput(issue.title || "");
      setDescInput(issue.description || "");
      setPointsInput(
        issue.story_points !== null && issue.story_points !== undefined
          ? String(issue.story_points)
          : "",
      );
      setEstimateHoursInput(
        issue.estimated_time !== null && issue.estimated_time !== undefined
          ? String(issue.estimated_time)
          : "",
      );
    }
  }, [issue]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc) {
      descInputRef.current?.focus();
    }
  }, [isEditingDesc]);

  const handleOpenSubtask = (subtask: IssueItem) => {
    setHistoryStack((prev) => [...prev, currentIssueId]);
    setCurrentIssueId(subtask.id);
    setSearchParams((prev) => {
      prev.set("selectedIssue", String(subtask.id));
      return prev;
    });
  };

  const handleBackToParent = () => {
    if (historyStack.length === 0) return;
    const previousId = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setCurrentIssueId(previousId);
    setSearchParams((prev) => {
      prev.set("selectedIssue", String(previousId));
      return prev;
    });
  };

  const handleConfirmDelete = () => {
    deleteIssue(
      {
        subdomain,
        projectSlug,
        issueId: currentIssueId,
      },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          if (canGoBack) {
            handleBackToParent();
          } else {
            onClose();
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex items-center justify-center font-mono text-xs text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Loading item details...
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 p-6 font-mono text-xs text-red-400 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Error</span>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1 rounded-xs"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p>Failed to load work item details.</p>
        </div>
      </div>
    );
  }

  const isSubtask = issue.issue_type === "subtask";
  const canGoBack = historyStack.length > 0;

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== issue.title) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { title: trimmed },
      });
    } else {
      setTitleInput(issue.title);
    }
  };

  const handleSaveDesc = () => {
    setIsEditingDesc(false);
    if (descInput !== (issue.description || "")) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { description: descInput },
      });
    }
  };

  const handleSavePoints = () => {
    setPointsEditLocation(null);
    const trimmed = pointsInput.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (
      parsed !== issue.story_points &&
      (parsed === null || (!isNaN(parsed) && parsed >= 0))
    ) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { story_points: parsed },
      });
    } else {
      setPointsInput(
        issue.story_points !== null && issue.story_points !== undefined
          ? String(issue.story_points)
          : "",
      );
    }
  };

  const handleSaveEstimateHours = () => {
    setIsEditingEstimateHours(false);
    const trimmed = estimateHoursInput.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (
      parsed !== issue.estimated_time &&
      (parsed === null || (!isNaN(parsed) && parsed >= 0))
    ) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { estimated_time: parsed },
      });
    } else {
      setEstimateHoursInput(
        issue.estimated_time !== null && issue.estimated_time !== undefined
          ? String(issue.estimated_time)
          : "",
      );
    }
  };

  const handleDueDateChange = (newDate: string | null) => {
    updateIssue({
      subdomain,
      projectSlug,
      issueId: currentIssueId,
      data: { due_date: newDate },
    });
  };

  const handleStatusChange = (val: string | null) => {
    const status_id = Number(val);
    if (status_id !== issue.status_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { status_id },
      });
    }
  };

  const handlePriorityChange = (val: string | null) => {
    const priority = val as WorkItemPriority;
    if (priority !== issue.priority) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { priority },
      });
    }
  };

  const handleAssigneeChange = (val: string | null) => {
    const assignee_id = val === "unassigned" ? null : Number(val);
    if (assignee_id !== issue.assignee_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { assignee_id },
      });
    }
  };

  const handleSprintChange = (val: string | null) => {
    const sprint_id = val === "none" ? null : Number(val);
    if (sprint_id !== issue.sprint_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { sprint_id },
      });
    }
  };

  const handleParentChange = (val: string | null) => {
    const parent_id = val === "none" ? null : Number(val);
    if (parent_id !== issue.parent_id) {
      updateIssue({
        subdomain,
        projectSlug,
        issueId: currentIssueId,
        data: { parent_id },
      });
    }
  };

  const handleAttachExistingLabel = (label: IssueLabel) => {
    addLabel({
      subdomain,
      projectSlug,
      issueId: currentIssueId,
      data: { label_id: label.id },
    });
    setLabelSearch("");
    setIsLabelOpen(false);
  };

  const handleCreateAndAttachLabel = () => {
    const trimmed = labelSearch.trim();
    if (!trimmed) return;
    addLabel({
      subdomain,
      projectSlug,
      issueId: currentIssueId,
      data: { name: trimmed },
    });
    setLabelSearch("");
    setIsLabelOpen(false);
  };

  const handleRemoveLabel = (labelId: number) => {
    removeLabel({
      subdomain,
      projectSlug,
      issueId: currentIssueId,
      labelId,
    });
  };

  const currentLabels = issue.labels || [];
  const assignedLabelIds = new Set(currentLabels.map((l) => l.id));
  const filteredSuggestions = labelSuggestions.filter(
    (l) => !assignedLabelIds.has(l.id),
  );

  return (
    <>
      <div className="h-full w-full bg-[#09090B] border-l border-white/10 flex flex-col font-mono text-white text-xs select-none">
        <IssueDetailHeader
          issue={issue}
          statuses={statuses}
          isEditingPoints={pointsEditLocation === "header"}
          pointsInput={pointsInput}
          onPointsInputChange={setPointsInput}
          onSavePoints={handleSavePoints}
          onCancelPoints={() => {
            setPointsEditLocation(null);
            setPointsInput(
              issue.story_points !== null && issue.story_points !== undefined
                ? String(issue.story_points)
                : "",
            );
          }}
          onStartEditingPoints={() => {
            setPointsInput(
              issue.story_points !== null && issue.story_points !== undefined
                ? String(issue.story_points)
                : "",
            );
            setPointsEditLocation("header");
          }}
          onStatusChange={handleStatusChange}
          onClose={onClose}
          onBack={handleBackToParent}
          canGoBack={canGoBack}
          onDelete={() => setIsDeleteModalOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setTitleInput(issue.title);
                  }
                }}
                className="bg-black border-amber-500 text-zinc-100 font-sans text-sm font-semibold h-8 rounded-xs px-2"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-semibold text-zinc-100 font-sans leading-snug cursor-pointer hover:bg-white/5 p-1 rounded-xs transition-colors"
              >
                {issue.title}
              </h2>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Description
              </span>
            </div>
            {isEditingDesc ? (
              <div className="space-y-2">
                <Textarea
                  ref={descInputRef}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  rows={5}
                  className="bg-black border-amber-500 text-zinc-200 text-xs font-sans rounded-xs p-2.5 resize-y focus-visible:ring-0"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingDesc(false);
                      setDescInput(issue.description || "");
                    }}
                    className="h-7 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white rounded-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveDesc}
                    className="h-7 text-xs bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xs cursor-pointer"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="text-zinc-300 font-sans text-xs leading-relaxed bg-black/40 p-3 rounded-xs border border-white/5 whitespace-pre-wrap cursor-pointer hover:border-white/20 transition-colors min-h-16"
              >
                {issue.description ? (
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                ) : (
                  <span className="text-zinc-600 italic">
                    Click to add a description...
                  </span>
                )}
              </div>
            )}
          </div>

          {!isSubtask && (
            <IssueSubtasksSection
              subdomain={subdomain}
              projectSlug={projectSlug}
              issueId={currentIssueId}
              onSelectSubtask={handleOpenSubtask}
            />
          )}

          <IssueInfoCard
            issue={issue}
            statuses={statuses}
            members={members}
            boardSprints={boardSprints}
            epics={epics}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onAssigneeChange={handleAssigneeChange}
            onSprintChange={handleSprintChange}
            onParentChange={handleParentChange}
            onDueDateChange={handleDueDateChange}
            isEditingEstimateHours={isEditingEstimateHours}
            estimateHoursInput={estimateHoursInput}
            onEstimateHoursInputChange={setEstimateHoursInput}
            onSaveEstimateHours={handleSaveEstimateHours}
            onCancelEstimateHours={() => {
              setIsEditingEstimateHours(false);
              setEstimateHoursInput(
                issue.estimated_time !== null &&
                  issue.estimated_time !== undefined
                  ? String(issue.estimated_time)
                  : "",
              );
            }}
            onStartEditingEstimateHours={() => {
              setEstimateHoursInput(
                issue.estimated_time !== null &&
                  issue.estimated_time !== undefined
                  ? String(issue.estimated_time)
                  : "",
              );
              setIsEditingEstimateHours(true);
            }}
            isEditingPoints={pointsEditLocation === "info"}
            pointsInput={pointsInput}
            onPointsInputChange={setPointsInput}
            onSavePoints={handleSavePoints}
            onCancelPoints={() => {
              setPointsEditLocation(null);
              setPointsInput(
                issue.story_points !== null && issue.story_points !== undefined
                  ? String(issue.story_points)
                  : "",
              );
            }}
            onStartEditingPoints={() => {
              setPointsInput(
                issue.story_points !== null && issue.story_points !== undefined
                  ? String(issue.story_points)
                  : "",
              );
              setPointsEditLocation("info");
            }}
          />

          <IssueLabelsCard
            labels={currentLabels}
            isLabelOpen={isLabelOpen}
            onLabelOpenChange={setIsLabelOpen}
            labelSearch={labelSearch}
            onLabelSearchChange={setLabelSearch}
            filteredSuggestions={filteredSuggestions}
            isAddingLabel={isAddingLabel}
            onAttachExistingLabel={handleAttachExistingLabel}
            onCreateAndAttachLabel={handleCreateAndAttachLabel}
            onRemoveLabel={handleRemoveLabel}
          />

          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Activity
            </span>
            <div className="space-y-2 text-[11px] text-zinc-400 font-sans">
              <div className="flex items-center justify-between">
                <span>Issue created</span>
                <span className="text-[10px] font-mono text-zinc-600">
                  {formatRelativeTime(issue.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status updated to {issue.status_name}</span>
                <span className="text-[10px] font-mono text-zinc-600">
                  {formatRelativeTime(issue.updated_at)}
                </span>
              </div>
            </div>
          </div>

          <IssueCommentsSection
            subdomain={subdomain}
            projectSlug={projectSlug}
            issueId={currentIssueId}
          />

          <IssueAttachmentsSection
            subdomain={subdomain}
            projectSlug={projectSlug}
            issueId={currentIssueId}
          />
        </div>
      </div>

      <DeleteIssueConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        issueKey={issue.key}
        issueTitle={issue.title}
        issueType={issue.issue_type}
        isPending={isDeletingIssue}
      />
    </>
  );
}
