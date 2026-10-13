import { useEffect, useRef } from "react";

interface ShortcutHandlers {
  onSearch?: () => void;
  onNew?: () => void;
  onNotifications?: () => void;
  onEscape?: () => void;
  onGoToProjects?: () => void;
  onGoToOrganizations?: () => void;
}

export function useKeyboardShortcuts({
  onSearch,
  onNew,
  onNotifications,
  onEscape,
  onGoToProjects,
  onGoToOrganizations,
}: ShortcutHandlers) {
  const pendingKeyRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isEditing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (event.key === "Escape") {
        pendingKeyRef.current = null;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onEscape?.();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onSearch?.();
        return;
      }

      if (
        event.key.toLowerCase() === "n" &&
        event.shiftKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        onNotifications?.();
        return;
      }

      if (isEditing) return;

      const key = event.key.toLowerCase();

      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        if (pendingKeyRef.current === "g") {
          if (key === "p") {
            event.preventDefault();
            onGoToProjects?.();
          } else if (key === "o") {
            event.preventDefault();
            onGoToOrganizations?.();
          }
          pendingKeyRef.current = null;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          return;
        }

        if (key === "g") {
          pendingKeyRef.current = "g";
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            pendingKeyRef.current = null;
          }, 1000);
          return;
        }

        if (key === "n") {
          event.preventDefault();
          onNew?.();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    onSearch,
    onNew,
    onNotifications,
    onEscape,
    onGoToProjects,
    onGoToOrganizations,
  ]);
}
