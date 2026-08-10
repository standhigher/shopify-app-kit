export type AdminTarget = string | { path: string };

export interface OpenExternalOptions {
  newWindow?: boolean;
  confirm?: () => boolean | Promise<boolean>;
}

export interface AppNavigation {
  navigate: (path: string) => Promise<void>;
  openAdmin: (input: AdminTarget) => Promise<void>;
  openExternal: (url: string, options?: OpenExternalOptions) => Promise<void>;
}
