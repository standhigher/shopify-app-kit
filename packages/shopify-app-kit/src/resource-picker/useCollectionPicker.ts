import { useCallback } from "react";
import { useShopifyAppKit } from "../providers/ShopifyAppKitContext";
import type { PickerItem, PickerOptions, PickerResult } from "./picker-types";

export function useCollectionPicker<TItem extends PickerItem = PickerItem>() {
  const { resourcePicker } = useShopifyAppKit();

  const open = useCallback(
    async (options?: PickerOptions): Promise<PickerResult<TItem>> => {
      if (!resourcePicker?.openCollectionPicker) {
        return { canceled: true, selection: [] };
      }
      return (await resourcePicker.openCollectionPicker(options)) as PickerResult<TItem>;
    },
    [resourcePicker]
  );

  return { open };
}
