import { useEffect, useId } from "react";

export interface AppModalProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

export function AppModal({ open, title, children, footer, onClose }: AppModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <div>{children}</div>
      {footer ? <footer>{footer}</footer> : null}
      <button type="button" onClick={onClose} aria-label="Close dialog">
        Close
      </button>
    </div>
  );
}
