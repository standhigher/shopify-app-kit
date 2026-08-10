import { render, screen } from "@testing-library/react";
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
  it("shows and closes toast messages", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastProbe />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByRole("status")).toHaveTextContent("Saved");

    await user.click(screen.getByRole("button", { name: "Close notification" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("renders banner variants", () => {
    render(<AppBanner tone="critical" title="Needs attention" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Needs attention");
  });

  it("renders modal with an accessible name and escape close", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AppModal open title="Edit settings" onClose={onClose}>
        Content
      </AppModal>
    );

    expect(screen.getByRole("dialog", { name: "Edit settings" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("supports destructive confirm copy and loading state", () => {
    render(
      <ConfirmDialog
        open
        title="Delete product"
        destructive
        loading
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />
    );

    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
  });

  it("resolves promise-style confirmations", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ConfirmProbe />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Ask" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
