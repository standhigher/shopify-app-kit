import { AppProvider, Frame } from "@shopify/polaris";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AppModal,
  ConfirmDialog,
  ToastProvider,
  useToast
} from "@standhigher/shopify-app-kit/feedback";
import {
  ShopifyAppKitProvider,
  useShopifyAppKit
} from "@standhigher/shopify-app-kit/core";
import { AppSaveBar } from "@standhigher/shopify-app-kit/save-flow";

function ContextProbe() {
  const { locale, messages } = useShopifyAppKit();
  return <output>{`${locale}:${messages.save}:${messages.cancel}:${messages.unsavedChanges}`}</output>;
}

function ToastProbe() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.success("Saved")}>success</button>
      <button onClick={() => toast.info("Info")}>info</button>
      <button onClick={() => toast.error("Error")}>error</button>
    </>
  );
}

describe("0.7.x experience", () => {
  it("falls back from regional locales to supported locale dictionaries", () => {
    render(
      <ShopifyAppKitProvider appName="Demo" locale="zh-CN">
        <ContextProbe />
      </ShopifyAppKitProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("zh-CN:保存:取消:你有未保存的更改。");

    render(
      <ShopifyAppKitProvider appName="Demo" locale="zh-TW">
        <ContextProbe />
      </ShopifyAppKitProvider>
    );
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("zh-TW:保存:取消:你有未保存的更改。");
  });

  it("lets provider messages override localized defaults", () => {
    render(
      <ShopifyAppKitProvider
        appName="Demo"
        locale="zh-CN"
        messages={{ save: "应用", unsavedChanges: "请先保存更改" }}
      >
        <ContextProbe />
      </ShopifyAppKitProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("zh-CN:应用:取消:请先保存更改");
  });

  it("uses a renderer slot while preserving the default component contract", () => {
    const renderModal = vi.fn(({ DefaultComponent, ...props }) => (
      <div data-testid="custom-modal-shell">
        <DefaultComponent {...props} />
      </div>
    ));
    render(
      <ShopifyAppKitProvider
        appName="Demo"
        renderers={{ modal: renderModal }}
      >
        <AppProvider i18n={{}}>
          <AppModal open title="Accessible modal" onClose={() => undefined}>
            Body
          </AppModal>
        </AppProvider>
      </ShopifyAppKitProvider>
    );
    expect(screen.getByTestId("custom-modal-shell")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Accessible modal" })).toBeInTheDocument();
    expect(renderModal).toHaveBeenCalled();
  });

  it("locks body scrolling and restores the opener when a modal closes", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(false);
      return <><button onClick={() => setOpen(true)}>Open settings</button><AppModal open={open} title="Settings" onClose={() => setOpen(false)}><button>Inside</button></AppModal></>;
    }
    render(
      <AppProvider i18n={{}}>
        <Harness />
      </AppProvider>
    );
    const opener = screen.getByRole("button", { name: "Open settings" });
    opener.focus();
    fireEvent.click(opener);
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Open settings"));
  });

  it("gives modal content initial focus, supports backdrop close, and exposes dialog ARIA", async () => {
    const onClose = vi.fn();
    render(
      <AppProvider i18n={{}}>
        <AppModal open title="Accessible" onClose={onClose}>
          <button>First action</button>
        </AppModal>
      </AppProvider>
    );
    const dialog = screen.getByRole("dialog", { name: "Accessible" });
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    fireEvent.click(document.querySelector(".Polaris-Backdrop") as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("only closes the topmost modal when multiple modals are open", async () => {
    const user = userEvent.setup();
    const bottomClose = vi.fn();
    const topClose = vi.fn();
    render(
      <AppProvider i18n={{}}>
        <AppModal open title="Bottom" onClose={bottomClose}>Bottom</AppModal>
        <AppModal open title="Top" onClose={topClose}>Top</AppModal>
      </AppProvider>
    );
    await user.keyboard("{Escape}");
    expect(topClose).toHaveBeenCalledTimes(1);
    expect(bottomClose).not.toHaveBeenCalled();
  });

  it("auto dismisses toasts, caps visible toasts, and optionally deduplicates", async () => {
    render(
      <AppProvider i18n={{}}>
        <Frame>
          <ToastProvider duration={1} maxToasts={2} dedupe>
            <ToastProbe />
          </ToastProvider>
        </Frame>
      </AppProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "success" }));
    fireEvent.click(screen.getByRole("button", { name: "success" }));
    fireEvent.click(screen.getByRole("button", { name: "info" }));
    fireEvent.click(screen.getByRole("button", { name: "error" }));
    expect(document.querySelectorAll('[class*="Polaris-Frame-Toast"]').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getAllByText("Saved").length).toBeLessThanOrEqual(1);
    await waitFor(() => expect(screen.queryByText("Error")).not.toBeInTheDocument());
  });

  it("localizes confirmation and save bar defaults through the provider", () => {
    render(
      <AppProvider i18n={{}}>
        <Frame>
          <ShopifyAppKitProvider appName="Demo" locale="zh-CN">
            <ConfirmDialog open title="删除？" onCancel={() => undefined} onConfirm={() => undefined} />
            <AppSaveBar dirty onSave={() => undefined} onDiscard={() => undefined} />
          </ShopifyAppKitProvider>
        </Frame>
      </AppProvider>
    );
    expect(screen.getByRole("button", { name: "确认" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "放弃" })).toBeInTheDocument();
  });
});
