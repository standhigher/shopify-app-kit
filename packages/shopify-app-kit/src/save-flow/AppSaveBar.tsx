import { defaultMessages } from "../i18n/defaultMessages";

export interface AppSaveBarProps {
  dirty: boolean;
  saving?: boolean;
  saveLabel?: string;
  discardLabel?: string;
  onSave: () => Promise<void> | void;
  onDiscard: () => Promise<void> | void;
}

export function AppSaveBar({
  dirty,
  saving = false,
  saveLabel = defaultMessages.save,
  discardLabel = defaultMessages.discard,
  onSave,
  onDiscard
}: AppSaveBarProps) {
  if (!dirty) {
    return null;
  }

  return (
    <div role="region" aria-label="Unsaved changes" data-app-kit-save-bar="">
      <button type="button" onClick={onDiscard} disabled={saving}>
        {discardLabel}
      </button>
      <button type="button" onClick={onSave} disabled={saving}>
        {saving ? defaultMessages.saving : saveLabel}
      </button>
    </div>
  );
}
