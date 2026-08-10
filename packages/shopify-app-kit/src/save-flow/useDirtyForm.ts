import { useCallback, useMemo, useState } from "react";

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
  const dirty = useMemo(
    () => !compare(cleanSnapshot, value),
    [cleanSnapshot, compare, value]
  );

  const save = useCallback(async () => {
    setStatus("saving");
    setError(undefined);
    try {
      await onSave?.(value);
      setCleanSnapshot(value);
      setStatus("saved");
    } catch (saveError) {
      setError(saveError);
      setStatus("error");
      throw saveError;
    }
  }, [onSave, value]);

  const discard = useCallback(() => {
    onDiscard?.();
    setError(undefined);
    setStatus("idle");
  }, [onDiscard]);

  return {
    dirty,
    status: dirty && status === "idle" ? "dirty" : status,
    error,
    save,
    discard
  };
}
