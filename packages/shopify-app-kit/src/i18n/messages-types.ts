export interface AppKitMessages {
  save: string;
  discard: string;
  saving: string;
  saved: string;
  confirm: string;
  cancel: string;
  delete: string;
  deleting: string;
  unsavedChanges: string;
}

export type AppKitMessageOverrides = Partial<AppKitMessages>;
