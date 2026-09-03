import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode
} from "react";
import { Toast } from "@shopify/polaris";
import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";

export type ToastTone = "success" | "error" | "info";

interface ToastMessage {
  id: string;
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

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
  maxToasts?: number;
  dedupe?: boolean;
}

interface FeedbackContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function ToastProvider({ children, duration = 5000, maxToasts = 3, dedupe = false }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null);
  const toastTimers = useRef(new Map<string, number>());

  const push = useCallback((tone: ToastTone, message: string) => {
    setToasts((current) => {
      if (dedupe && current.some((toast) => toast.tone === tone && toast.message === message)) return current;
      const next = [...current, { id: `${Date.now()}-${Math.random()}`, tone, message }];
      return next.slice(-Math.max(0, maxToasts));
    });
  }, [dedupe, maxToasts]);

  const remove = useCallback((id: string) => {
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

  useEffect(() => {
    const activeIds = new Set(toasts.map((toast) => toast.id));
    toasts.forEach((toast) => {
      if (toastTimers.current.has(toast.id)) return;
      const timer = window.setTimeout(() => {
        toastTimers.current.delete(toast.id);
        remove(toast.id);
      }, duration);
      toastTimers.current.set(toast.id, timer);
    });
    toastTimers.current.forEach((timer, id) => {
      if (!activeIds.has(id)) {
        window.clearTimeout(timer);
        toastTimers.current.delete(id);
      }
    });
  }, [duration, remove, toasts]);

  useEffect(() => () => {
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current.clear();
  }, []);

  const CustomToast = useContext(ShopifyAppKitContext)?.renderers?.toast;
  const DefaultToast = (props: { content: string; error?: boolean; duration?: number; onDismiss: () => void }) => (
    <Toast content={props.content} error={props.error} duration={props.duration} onDismiss={props.onDismiss} />
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div aria-live="polite">
        {toasts.map((toast) => (
          CustomToast ? (
            <div key={toast.id} role="status" aria-atomic="true">
              <CustomToast content={toast.message} error={toast.tone === "error"} duration={duration} onDismiss={() => remove(toast.id)} DefaultComponent={DefaultToast} />
            </div>
          ) : (
            <div key={toast.id} role="status" aria-atomic="true">
              <Toast content={toast.message} error={toast.tone === "error"} duration={duration} onDismiss={() => remove(toast.id)} />
            </div>
          )
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
