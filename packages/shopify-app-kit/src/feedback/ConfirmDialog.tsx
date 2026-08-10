import { defaultMessages } from "../i18n/defaultMessages";
import { AppModal } from "./AppModal";

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
          <button type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            data-destructive={destructive ? "" : undefined}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingLabel : actionLabel}
          </button>
        </>
      }
    >
      {description ? <p>{description}</p> : null}
    </AppModal>
  );
}
