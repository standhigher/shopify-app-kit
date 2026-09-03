import type React from "react";
import type { AppKitMessageOverrides, AppKitMessages } from "../i18n/messages-types";
import type { AppKitEnvironment } from "../runtime/environment";
import type { AnalyticsClient } from "../analytics/analytics-types";

export interface NavigationAdapter {
  navigate?: (path: string) => void | Promise<void>;
  openAdmin?: (path: string) => void | Promise<void>;
  openExternal?: (url: string, options?: OpenExternalOptions) => void | Promise<void>;
}

export interface SaveBarAdapter {
  show: (id: string) => void | Promise<void>;
  hide: (id: string) => void | Promise<void>;
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
  analytics?: AnalyticsClient;
  navigation?: NavigationAdapter;
  saveBar?: SaveBarAdapter;
  resourcePicker?: ResourcePickerAdapter;
  environment?: AppKitEnvironment;
  renderers?: AppKitRenderers;
}

export interface AppKitRenderers {
  banner?: React.ComponentType<BannerRendererProps>;
  modal?: React.ComponentType<ModalRendererProps>;
  toast?: React.ComponentType<ToastRendererProps>;
  saveBar?: React.ComponentType<SaveBarRendererProps>;
}

export interface BannerRendererProps {
  title: string;
  tone?: "info" | "success" | "warning" | "critical";
  children?: React.ReactNode;
  DefaultComponent: React.ComponentType<Omit<BannerRendererProps, "DefaultComponent">>;
}

export interface ModalRendererProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  DefaultComponent: React.ComponentType<Omit<ModalRendererProps, "DefaultComponent">>;
}

export interface ToastRendererProps {
  content: string;
  error?: boolean;
  duration?: number;
  onDismiss: () => void;
  DefaultComponent: React.ComponentType<Omit<ToastRendererProps, "DefaultComponent">>;
}

export interface SaveBarRendererProps {
  dirty: boolean;
  saving?: boolean;
  id?: string;
  saveLabel?: string;
  discardLabel?: string;
  onSave: () => Promise<void> | void;
  onDiscard: () => Promise<void> | void;
  DefaultComponent: React.ComponentType<Omit<SaveBarRendererProps, "DefaultComponent">>;
}

export interface ShopifyAppKitContextValue {
  appName: string;
  locale: string;
  shop?: string;
  messages: AppKitMessages;
  analytics?: AnalyticsClient;
  navigation?: NavigationAdapter;
  saveBar?: SaveBarAdapter;
  resourcePicker?: ResourcePickerAdapter;
  environment: AppKitEnvironment;
  renderers?: AppKitRenderers;
}
