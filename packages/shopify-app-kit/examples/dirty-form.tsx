import { AppProvider, Frame } from "@shopify/polaris";
import { AppSaveBar, LeaveGuard, useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";

export function DirtyFormExample({
  value,
  onSave,
  onDiscard
}: {
  value: { name: string };
  onSave: (value: { name: string }) => Promise<void>;
  onDiscard: () => void;
}) {
  const form = useDirtyForm({
    initialValue: { name: "" },
    value,
    onSave,
    onDiscard
  });

  return (
    <AppProvider i18n={{}}>
      <Frame>
        <LeaveGuard dirty={form.dirty} />
        <AppSaveBar
          dirty={form.dirty}
          saving={form.status === "saving"}
          onSave={form.save}
          onDiscard={form.discard}
        />
      </Frame>
    </AppProvider>
  );
}
