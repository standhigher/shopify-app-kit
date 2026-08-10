import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";

export type ToastTone = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  tone: ToastTone;
  message: string;
}

export interface ConfirmOptions {
  title: string;
  description?: string;
  destructive?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface FeedbackContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null);

  const push = useCallback((tone: ToastTone, message: string) => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), tone, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const value = useMemo<FeedbackContextValue>(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
      info: (message) => push("info", message),
      confirm
    }),
    [confirm, push]
  );

  const closeConfirm = (result: boolean) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} role="status" data-tone={toast.tone}>
            {toast.message}
            <button
              type="button"
              onClick={() => remove(toast.id)}
              aria-label="Close notification"
            >
              Close
            </button>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title ?? ""}
        description={confirmState?.description}
        destructive={confirmState?.destructive}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </FeedbackContext.Provider>
  );
}

function useFeedbackContext(): FeedbackContextValue {
  const value = useContext(FeedbackContext);
  if (!value) {
    throw new Error("Feedback hooks must be used inside ToastProvider.");
  }
  return value;
}

export function useToast() {
  const { success, error, info } = useFeedbackContext();
  return { success, error, info };
}

export function useConfirm() {
  const { confirm } = useFeedbackContext();
  return confirm;
}

export type { ConfirmDialogProps };
