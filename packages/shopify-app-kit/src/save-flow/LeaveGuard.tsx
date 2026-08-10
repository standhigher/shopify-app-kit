import { useEffect } from "react";

export interface LeaveGuardProps {
  dirty: boolean;
  message?: string;
}

export function LeaveGuard({ dirty, message = "You have unsaved changes." }: LeaveGuardProps) {
  useEffect(() => {
    if (!dirty || typeof window === "undefined") {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, message]);

  return null;
}
