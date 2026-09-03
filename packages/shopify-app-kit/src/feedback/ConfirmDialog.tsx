import { defaultMessages } from "../i18n/defaultMessages";
import { AppModal } from "./AppModal";
import { Button } from "@shopify/polaris";

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
  cancelLabel = defaultMessages.cancel,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const actionLabel =
    confirmLabel ?? (destructive ? defaultMessages.delete : defaultMessages.confirm);
  const loadingLabel =
    destructive ? defaultMessages.deleting : defaultMessages.saving;

  return (
    <AppModal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel} disabled={loading}>
            {cancelLabel}
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
