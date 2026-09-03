import { defaultMessages } from "../i18n/defaultMessages";
import { ContextualSaveBar } from "@shopify/polaris";

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
    <div data-app-kit-save-bar="">
      <ContextualSaveBar
        saveAction={{ content: saveLabel, loading: saving, disabled: saving, onAction: onSave }}
        discardAction={{ content: discardLabel, disabled: saving, onAction: onDiscard }}
      />
    </div>
  );
}
