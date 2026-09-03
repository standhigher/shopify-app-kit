import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DirtyFormStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export interface UseDirtyFormOptions<TValue> {
  initialValue: TValue;
  value: TValue;
  onSave?: (value: TValue) => Promise<void> | void;
  onDiscard?: () => void;
  compare?: (clean: TValue, current: TValue) => boolean;
}

function defaultCompare<TValue>(clean: TValue, current: TValue): boolean {
  return JSON.stringify(clean) === JSON.stringify(current);
}

export function useDirtyForm<TValue>({
  initialValue,
  value,
  onSave,
  onDiscard,
  compare = defaultCompare
}: UseDirtyFormOptions<TValue>) {
  const [cleanSnapshot, setCleanSnapshot] = useState(initialValue);
  const [status, setStatus] = useState<DirtyFormStatus>("idle");
  const [error, setError] = useState<unknown>();
  const initialValueRef = useRef(initialValue);
  const savePromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (compare(initialValueRef.current, initialValue)) {
      return;
    }

    initialValueRef.current = initialValue;
    setCleanSnapshot(initialValue);
    setError(undefined);
    setStatus("idle");
  }, [compare, initialValue]);

  const dirty = useMemo(
    () => !compare(cleanSnapshot, value),
    [cleanSnapshot, compare, value]
  );

  const save = useCallback(() => {
    if (savePromiseRef.current) {
      return savePromiseRef.current;
    }

    const savedValue = value;
    const savePromise = (async () => {
      setStatus("saving");
      setError(undefined);
      try {
        await onSave?.(savedValue);
        setCleanSnapshot(savedValue);
        setStatus("saved");
      } catch (saveError) {
        setError(saveError);
        setStatus("error");
        throw saveError;
      }
    })();

    savePromiseRef.current = savePromise.finally(() => {
      savePromiseRef.current = null;
    });
    return savePromiseRef.current;
  }, [onSave, value]);

  const discard = useCallback(() => {
    onDiscard?.();
    setError(undefined);
    setStatus("idle");
  }, [onDiscard]);

  return {
    dirty,
    status: dirty && (status === "idle" || status === "saved") ? "dirty" : status,
    error,
    save,
    discard
  };
}
