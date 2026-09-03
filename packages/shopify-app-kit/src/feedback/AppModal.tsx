import { useEffect } from "react";
import { Modal } from "@shopify/polaris";

export interface AppModalProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

export function AppModal({ open, title, children, footer, onClose }: AppModalProps) {
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

  return <Modal open={open} title={title} onClose={onClose} footer={footer}>{children}</Modal>;
}
