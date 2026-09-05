import { createElement, useContext, useEffect, useMemo, useState } from "react";
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

function NativeSaveBar({
  id,
  saving,
  saveLabel,
  discardLabel,
  onSave,
  onDiscard
}: Omit<AppSaveBarProps, "adapter">) {
  return createElement(
    "ui-save-bar",
    { id, "data-app-kit-save-bar": "" },
    createElement(
      "button",
      { variant: "primary", disabled: saving, onClick: () => void onSave() },
      saveLabel ?? "Save"
    ),
    createElement("button", { disabled: saving, onClick: () => void onDiscard() }, discardLabel ?? "Discard")
  );
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
        console.warn("Shopify App Bridge Save Bar unavailable; provide renderers.saveBar for a custom fallback.", error);
      }
    });
    return () => {
      active = false;
      if (dirty) Promise.resolve(adapter.hide(id)).catch(() => undefined);
    };
  }, [adapter, bridgeFailed, dirty, id]);

  if (!dirty) return null;

  const CustomRenderer = context?.renderers?.saveBar;
  const defaultProps = {
    dirty,
    saving,
    id,
    saveLabel: saveLabel ?? messages.save,
    discardLabel: discardLabel ?? messages.discard,
    onSave,
    onDiscard
  } satisfies Omit<AppSaveBarProps, "adapter">;
  if (CustomRenderer) {
    return <CustomRenderer {...defaultProps} DefaultComponent={NativeSaveBar} />;
  }

  if (!adapter || bridgeFailed) return null;
  return <NativeSaveBar {...defaultProps} />;
}
