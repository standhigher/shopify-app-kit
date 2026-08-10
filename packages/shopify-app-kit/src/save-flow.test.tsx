import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AppSaveBar,
  LeaveGuard,
  useDirtyForm
} from "@standhigher/shopify-app-kit/save-flow";

describe("save flow", () => {
  it("tracks dirty, save, and discard state", async () => {
    let value = { name: "Initial" };
    const onSave = vi.fn(async () => undefined);
    const onDiscard = vi.fn(() => {
      value = { name: "Changed" };
    });

    const { result, rerender } = renderHook(() =>
      useDirtyForm({
        initialValue: { name: "Initial" },
        value,
        onSave,
        onDiscard
      })
    );

    expect(result.current.dirty).toBe(false);

    value = { name: "Changed" };
    rerender();

    expect(result.current.dirty).toBe(true);

    await act(async () => {
      await result.current.save();
    });

    expect(result.current.status).toBe("saved");
    expect(result.current.dirty).toBe(false);

    value = { name: "Changed again" };
    rerender();

    act(() => {
      result.current.discard();
    });
    rerender();

    expect(onDiscard).toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("keeps dirty state when save fails", async () => {
    let value = "draft";
    const { result, rerender } = renderHook(() =>
      useDirtyForm({
        initialValue: "clean",
        value,
        onSave: async () => {
          throw new Error("save failed");
        }
      })
    );

    value = "dirty";
    rerender();

    await act(async () => {
      await expect(result.current.save()).rejects.toThrow("save failed");
    });
    expect(result.current.dirty).toBe(true);
    expect(result.current.status).toBe("error");
  });

  it("renders a non-embedded fallback save bar", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    render(
      <AppSaveBar dirty onSave={onSave} onDiscard={onDiscard} saveLabel="Save" />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });

  it("registers a beforeunload guard while dirty", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<LeaveGuard dirty />);

    expect(add).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    unmount();
    expect(remove).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });
});
