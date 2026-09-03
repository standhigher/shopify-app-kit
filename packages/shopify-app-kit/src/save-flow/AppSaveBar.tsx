import { useContext, useEffect, useMemo, useState } from "react";
import { ContextualSaveBar } from "@shopify/polaris";
import { defaultMessages } from "../i18n/defaultMessages";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";
import { createShopifySaveBarAdapter } from "../shopify-adapters";
import type { SaveBarAdapter } from "../providers/provider-types";

export interface AppSaveBarProps {
  dirty: boolean;
  saving?: boolean;
  id?: string;
  adapter?: SaveBarAdapter;
  saveLabel?: string;
  discardLabel?: string;
  onSave: () => Promise<void> | void;
  onDiscard: () => Promise<void> | void;
}

export function AppSaveBar({
  dirty,
  saving = false,
  id = "app-kit-save-bar",
  adapter: explicitAdapter,
  saveLabel,
  discardLabel,
  onSave,
  onDiscard
}: AppSaveBarProps) {
  const context = useContext(ShopifyAppKitContext);
  const messages = context?.messages ?? defaultMessages;
  const [bridgeFailed, setBridgeFailed] = useState(false);
  const adapter = useMemo(
    () => explicitAdapter ?? context?.saveBar ?? createShopifySaveBarAdapter(),
    [explicitAdapter, context?.saveBar]
  );

  useEffect(() => {
    if (!adapter || bridgeFailed) return;
    let active = true;
    let action: void | Promise<void>;
    try {
      action = dirty ? adapter.show(id) : adapter.hide(id);
    } catch (error) {
      action = Promise.reject(error);
    }
    Promise.resolve(action).catch((error: unknown) => {
      if (!active) return;
      setBridgeFailed(true);
      if (typeof console !== "undefined") {
        console.warn("Shopify App Bridge Save Bar unavailable; using Polaris fallback.", error);
      }
    });
    return () => {
      active = false;
      if (dirty) Promise.resolve(adapter.hide(id)).catch(() => undefined);
    };
  }, [adapter, bridgeFailed, dirty, id]);

  if (!dirty || (adapter && !bridgeFailed)) return null;

  const CustomRenderer = context?.renderers?.saveBar;
  const DefaultSaveBar = (props: Omit<AppSaveBarProps, "adapter">) => (
    <div data-app-kit-save-bar="">
      <ContextualSaveBar
        saveAction={{ content: props.saveLabel ?? messages.save, loading: props.saving, disabled: props.saving, onAction: props.onSave }}
        discardAction={{ content: props.discardLabel ?? messages.discard, disabled: props.saving, onAction: props.onDiscard }}
      />
    </div>
  );
  if (CustomRenderer) {
    return <CustomRenderer dirty={dirty} saving={saving} id={id} saveLabel={saveLabel} discardLabel={discardLabel} onSave={onSave} onDiscard={onDiscard} DefaultComponent={DefaultSaveBar} />;
  }

  return (
    <DefaultSaveBar dirty={dirty} saving={saving} id={id} saveLabel={saveLabel} discardLabel={discardLabel} onSave={onSave} onDiscard={onDiscard} />
  );
}
