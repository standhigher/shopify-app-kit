import { AppProvider, Frame } from "@shopify/polaris";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AppBanner,
  AppModal,
  ConfirmDialog,
  ToastProvider,
  useConfirm,
  useToast
} from "@standhigher/shopify-app-kit/feedback";

function ToastProbe() {
  const toast = useToast();
  return <button onClick={() => toast.success("Saved")}>Show toast</button>;
}

function ConfirmProbe() {
  const confirm = useConfirm();
  return (
    <button
      onClick={async () => {
        await confirm({ title: "Delete item", destructive: true });
      }}
    >
      Ask
    </button>
  );
}

describe("feedback", () => {
  it("requires the host Polaris AppProvider for default visual components", () => {
    expect(() => render(<AppBanner title="Needs attention" />)).toThrow(/AppProvider/);
  });

  it("shows and closes toast messages", async () => {
    const user = userEvent.setup();
    render(
      <AppProvider i18n={{}}>
        <Frame>
          <ToastProvider>
            <ToastProbe />
          </ToastProvider>
        </Frame>
      </AppProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(document.querySelector('[class*="Polaris-Frame-Toast"]')).toBeInTheDocument();

    await user.click(document.querySelector('[class*="Toast__CloseButton"]') as HTMLElement);
    await waitFor(() => expect(screen.queryByText("Saved")).not.toBeInTheDocument());
  });

  it("renders banner variants", () => {
    render(
      <AppProvider i18n={{}}>
        <AppBanner tone="critical" title="Needs attention" />
      </AppProvider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Needs attention");
    expect(document.querySelector('[class*="Polaris-Banner"]')).toBeInTheDocument();
  });

  it("renders modal with an accessible name and escape close", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AppProvider i18n={{}}>
        <AppModal open title="Edit settings" onClose={onClose}>
          Content
        </AppModal>
      </AppProvider>
    );

    expect(screen.getByRole("dialog", { name: "Edit settings" })).toBeInTheDocument();
    expect(document.querySelector('[class*="Polaris-Modal"]')).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports destructive confirm copy and loading state", () => {
    render(
      <AppProvider i18n={{}}>
        <ConfirmDialog
          open
          title="Delete product"
          destructive
          loading
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />
      </AppProvider>
    );

    expect(screen.getByRole("button", { name: "Deleting..." })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("resolves promise-style confirmations", async () => {
    const user = userEvent.setup();
    render(
      <AppProvider i18n={{}}>
        <Frame>
          <ToastProvider>
            <ConfirmProbe />
          </ToastProvider>
        </Frame>
      </AppProvider>
    );

    await user.click(screen.getByRole("button", { name: "Ask" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
