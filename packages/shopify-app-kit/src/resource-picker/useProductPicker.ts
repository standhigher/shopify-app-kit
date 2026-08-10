import { useCallback } from "react";
import { useShopifyAppKit } from "../providers/ShopifyAppKitContext";
import type { PickerItem, PickerOptions, PickerResult } from "./picker-types";

export function useProductPicker<TItem extends PickerItem = PickerItem>() {
  const { resourcePicker } = useShopifyAppKit();

  const open = useCallback(
    async (options?: PickerOptions): Promise<PickerResult<TItem>> => {
      if (!resourcePicker?.openProductPicker) {
        return { canceled: true, selection: [] };
      }
      return (await resourcePicker.openProductPicker(options)) as PickerResult<TItem>;
    },
    [resourcePicker]
  );

  return { open };
}
