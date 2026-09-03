import type { AppKitMessages } from "./messages-types";
import { defaultMessages } from "./defaultMessages";

export const localeMessages: Record<string, AppKitMessages> = {
  en: {
    save: "Save",
    discard: "Discard",
    saving: "Saving...",
    saved: "Saved",
    confirm: "Confirm",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    unsavedChanges: "You have unsaved changes."
  },
  "zh-CN": {
    save: "保存",
    discard: "放弃",
    saving: "保存中...",
    saved: "已保存",
    confirm: "确认",
    cancel: "取消",
    delete: "删除",
    deleting: "删除中...",
    unsavedChanges: "你有未保存的更改。"
  }
};

export function getLocaleMessages(locale: string): AppKitMessages {
  const normalized = locale.trim().toLowerCase().replaceAll("_", "-");
  const language = normalized.split("-")[0];
  const key = normalized === "zh" || language === "zh" ? "zh-CN" : "en";
  return localeMessages[key] ?? localeMessages.en ?? defaultMessages;
}
