import { useContext, useEffect } from "react";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";

export interface LeaveGuardProps {
  dirty: boolean;
  message?: string;
}

export function LeaveGuard({ dirty, message = "You have unsaved changes." }: LeaveGuardProps) {
  const localizedMessage = useContext(ShopifyAppKitContext)?.messages.unsavedChanges ?? message;
  useEffect(() => {
    if (!dirty || typeof window === "undefined") {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message === "You have unsaved changes." ? localizedMessage : message;
      return event.returnValue;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, localizedMessage, message]);

  return null;
}
