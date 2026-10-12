import { useEffect } from "react";

interface ShortcutHandlers {
  onSearch?: () => void;
  onNew?: () => void;
  onNotifications?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onSearch,
  onNew,
  onNotifications,
  onEscape,
}: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isEditing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (event.key === "Escape") {
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

      if (
        event.key.toLowerCase() === "n" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        onNew?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onNew, onNotifications, onEscape]);
}
