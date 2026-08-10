import type React from "react";
import type { AppKitMessageOverrides, AppKitMessages } from "../i18n/messages-types";
import type { AppKitEnvironment } from "../runtime/environment";

export interface NavigationAdapter {
  navigate?: (path: string) => void | Promise<void>;
  openAdmin?: (path: string) => void | Promise<void>;
  openExternal?: (url: string, options?: OpenExternalOptions) => void | Promise<void>;
}

export interface OpenExternalOptions {
  newWindow?: boolean;
  confirm?: () => boolean | Promise<boolean>;
}

export interface PickerItem {
  id: string;
  title?: string;
  handle?: string;
  imageUrl?: string;
}

export interface PickerOptions {
  multiple?: boolean;
  selectionIds?: string[];
  filter?: string;
}

export interface PickerResult<TItem extends PickerItem = PickerItem> {
  canceled: boolean;
  selection: TItem[];
}

export interface ResourcePickerAdapter {
  openProductPicker?: (options?: PickerOptions) => Promise<PickerResult>;
  openCollectionPicker?: (options?: PickerOptions) => Promise<PickerResult>;
}

export interface ShopifyAppKitProviderProps {
  appName: string;
  children: React.ReactNode;
  locale?: string;
  shop?: string;
  messages?: AppKitMessageOverrides;
  analytics?: unknown;
  navigation?: NavigationAdapter;
  resourcePicker?: ResourcePickerAdapter;
  environment?: AppKitEnvironment;
}

export interface ShopifyAppKitContextValue {
  appName: string;
  locale: string;
  shop?: string;
  messages: AppKitMessages;
  analytics?: unknown;
  navigation?: NavigationAdapter;
  resourcePicker?: ResourcePickerAdapter;
  environment: AppKitEnvironment;
}
