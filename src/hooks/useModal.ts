import { useCallback, useState, useEffect } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
