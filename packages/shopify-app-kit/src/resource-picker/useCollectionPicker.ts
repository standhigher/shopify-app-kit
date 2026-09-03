import { useCallback } from "react";
import { useShopifyAppKit } from "../providers/ShopifyAppKitContext";
import { createShopifyResourcePickerAdapter } from "../shopify-adapters";
import type { PickerItem, PickerOptions, PickerResult } from "./picker-types";

export function useCollectionPicker<TItem extends PickerItem = PickerItem>() {
  const { resourcePicker } = useShopifyAppKit();

  const open = useCallback(
    async (options?: PickerOptions): Promise<PickerResult<TItem>> => {
      const adapter = resourcePicker ?? createShopifyResourcePickerAdapter();
      if (!adapter?.openCollectionPicker) {
        return { canceled: true, selection: [] };
      }
      return (await adapter.openCollectionPicker(options)) as PickerResult<TItem>;
    },
    [resourcePicker]
  );

  return { open };
}
