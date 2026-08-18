import { useEffect } from "react";

export default function useMasterShortcuts({
  onAdd,
  onModify,
  onDelete,
  onClear,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore shortcuts while typing in input fields
      const tag = event.target?.tagName?.toLowerCase();

      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        event.target?.isContentEditable;

      // ESC should always work
      if (event.key === "Escape") {
        event.preventDefault();

        if (onClose) {
          onClose();
        }

        return;
      }

      // F-keys should work even when focus is inside a form
      if (event.key === "F4") {
        event.preventDefault();

        if (onAdd) {
          onAdd();
        }

        return;
      }

      if (event.key === "F2") {
        event.preventDefault();

        if (onModify) {
          onModify();
        }

        return;
      }

      if (event.key === "F3") {
        event.preventDefault();

        if (onDelete) {
          onDelete();
        }

        return;
      }

      if (event.key === "F6") {
        event.preventDefault();

        if (onClear) {
          onClear();
        }

        return;
      }

      // Do not interfere with normal typing
      if (isTyping) {
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    onAdd,
    onModify,
    onDelete,
    onClear,
    onClose,
  ]);
}