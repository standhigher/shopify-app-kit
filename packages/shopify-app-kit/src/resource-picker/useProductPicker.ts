import { useCallback } from "react";
import { useShopifyAppKit } from "../providers/ShopifyAppKitContext";
import { createShopifyResourcePickerAdapter } from "../shopify-adapters";
import type { PickerItem, PickerOptions, PickerResult } from "./picker-types";

export function useProductPicker<TItem extends PickerItem = PickerItem>() {
  const { resourcePicker } = useShopifyAppKit();

  const open = useCallback(
    async (options?: PickerOptions): Promise<PickerResult<TItem>> => {
      const adapter = resourcePicker ?? createShopifyResourcePickerAdapter();
      if (!adapter?.openProductPicker) {
        return { canceled: true, selection: [] };
      }
      return (await adapter.openProductPicker(options)) as PickerResult<TItem>;
    },
    [resourcePicker]
  );

  return { open };
}
