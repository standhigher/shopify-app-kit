import { getAppBridgeRuntime } from "./runtime/appBridgeRuntime";
import type {
  NavigationAdapter,
  PickerItem,
  PickerOptions,
  PickerResult,
  ResourcePickerAdapter,
  SaveBarAdapter
} from "./providers/provider-types";

type RuntimeResource = { id?: unknown; title?: unknown; handle?: unknown; image?: unknown; images?: unknown };

function toItem(value: unknown): PickerItem | null {
  if (typeof value === "string") return { id: value };
  if (!value || typeof value !== "object") return null;
  const resource = value as RuntimeResource;
  if (typeof resource.id !== "string") return null;
  const image = resource.image ?? (Array.isArray(resource.images) ? resource.images[0] : undefined);
  let imageUrl: string | undefined;
  if (typeof image === "string") imageUrl = image;
  else if (image && typeof image === "object") {
    const candidate = image as { url?: unknown; originalSrc?: unknown; src?: unknown };
    imageUrl = [candidate.url, candidate.originalSrc, candidate.src].find(
      (item): item is string => typeof item === "string"
    );
  }
  return {
    id: resource.id,
    ...(typeof resource.title === "string" ? { title: resource.title } : {}),
    ...(typeof resource.handle === "string" ? { handle: resource.handle } : {}),
    ...(imageUrl ? { imageUrl } : {})
  };
}

function mapPickerResult(value: unknown): PickerResult {
  if (value == null) return { canceled: true, selection: [] };
  if (value && typeof value === "object" && (value as { canceled?: unknown }).canceled === true) {
    return { canceled: true, selection: [] };
  }
  const rawSelection = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { selection?: unknown }).selection)
      ? (value as { selection: unknown[] }).selection
      : [];
  return {
    canceled: false,
    selection: rawSelection.map(toItem).filter((item): item is PickerItem => item !== null)
  };
}

export function createShopifySaveBarAdapter(): SaveBarAdapter | undefined {
  const runtime = getAppBridgeRuntime();
  if (!runtime?.saveBar?.show || !runtime.saveBar.hide) return undefined;
  return {
    show: (id) => runtime.saveBar!.show(id),
    hide: (id) => runtime.saveBar!.hide(id)
  };
}

export function createShopifyNavigationAdapter(): NavigationAdapter | undefined {
  const runtime = getAppBridgeRuntime();
  const navigate = runtime?.navigate ?? runtime?.navigation?.navigate;
  if (!navigate) return undefined;
  return {
    navigate,
    openAdmin: runtime?.admin?.open
      ? (path) => runtime.admin!.open!(path)
      : runtime?.navigation?.open
        ? (path) => runtime.navigation!.open!(path)
        : navigate
  };
}

export function createShopifyResourcePickerAdapter(): ResourcePickerAdapter | undefined {
  const picker = getAppBridgeRuntime()?.resourcePicker;
  if (!picker) return undefined;
  const open = async (type: "product" | "collection", options?: PickerOptions) => {
    const result = await picker({
      type,
      action: "select",
      ...(options?.multiple !== undefined ? { multiple: options.multiple } : {}),
      ...(options?.selectionIds?.length ? { selectionIds: options.selectionIds } : {}),
      ...(options?.filter ? { query: options.filter } : {})
    });
    return mapPickerResult(result);
  };
  return {
    openProductPicker: (options) => open("product", options),
    openCollectionPicker: (options) => open("collection", options)
  };
}

export type {
  NavigationAdapter,
  PickerItem,
  PickerOptions,
  PickerResult,
  ResourcePickerAdapter,
  SaveBarAdapter
};
