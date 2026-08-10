export type {
  PickerItem,
  PickerOptions,
  PickerResult,
  ResourcePickerAdapter
} from "../providers/provider-types";

export interface PickerHook<TItem> {
  open: (options?: import("../providers/provider-types").PickerOptions) => Promise<
    import("../providers/provider-types").PickerResult<TItem & import("../providers/provider-types").PickerItem>
  >;
}
