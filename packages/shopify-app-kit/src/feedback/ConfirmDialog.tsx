import { defaultMessages } from "../i18n/defaultMessages";
import { AppModal } from "./AppModal";
import { Button } from "@shopify/polaris";
import { useContext } from "react";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  destructive?: boolean;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  destructive = false,
  loading = false,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const messages = useContext(ShopifyAppKitContext)?.messages ?? defaultMessages;
  const actionLabel =
    confirmLabel ?? (destructive ? messages.delete : messages.confirm);
  const loadingLabel =
    destructive ? messages.deleting : messages.saving;

  return (
    <AppModal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel} disabled={loading}>
            {cancelLabel ?? messages.cancel}
          </Button>
          <Button
            variant="primary"
            tone={destructive ? "critical" : undefined}
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
          >
            {loading ? loadingLabel : actionLabel}
          </Button>
        </>
      }
    >
      {description ? <p>{description}</p> : null}
    </AppModal>
  );
}
