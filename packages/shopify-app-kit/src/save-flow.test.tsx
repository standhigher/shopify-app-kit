import { AppProvider, Frame } from "@shopify/polaris";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
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

  it("resets the clean snapshot when the initial value changes", () => {
    const { result, rerender } = renderHook(
      ({ initialValue, value }: { initialValue: string; value: string }) =>
        useDirtyForm({ initialValue, value }),
      { initialProps: { initialValue: "old", value: "old" } }
    );

    rerender({ initialValue: "loaded", value: "loaded" });
    expect(result.current.dirty).toBe(false);
    expect(result.current.status).toBe("idle");

    rerender({ initialValue: "loaded", value: "edited" });
    expect(result.current.dirty).toBe(true);
    expect(result.current.status).toBe("dirty");
  });

  it("reports dirty after a saved value changes again", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDirtyForm({ initialValue: "clean", value }),
      { initialProps: { value: "draft" } }
    );

    await act(async () => {
      await result.current.save();
    });
    rerender({ value: "new draft" });

    expect(result.current.dirty).toBe(true);
    expect(result.current.status).toBe("dirty");
  });

  it("shares one in-flight promise when save is triggered twice", async () => {
    let resolveSave: (() => void) | undefined;
    const onSave = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveSave = resolve;
      })
    );
    const { result } = renderHook(() =>
      useDirtyForm({ initialValue: "clean", value: "draft", onSave })
    );

    let first: Promise<void> | undefined;
    let second: Promise<void> | undefined;
    act(() => {
      first = result.current.save();
      second = result.current.save();
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
    await act(async () => {
      resolveSave?.();
      await first;
    });
  });

  it("keeps a value edited during save dirty after the original value saves", async () => {
    let resolveSave: (() => void) | undefined;
    let value = "draft";
    const onSave = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveSave = resolve;
      })
    );
    const { result, rerender } = renderHook(() =>
      useDirtyForm({ initialValue: "clean", value, onSave })
    );

    let savePromise: Promise<void> | undefined;
    act(() => {
      savePromise = result.current.save();
    });
    value = "edited while saving";
    rerender();

    await act(async () => {
      resolveSave?.();
      await savePromise;
    });

    expect(result.current.dirty).toBe(true);
    expect(result.current.status).toBe("dirty");
  });

  it("renders a non-embedded fallback save bar", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    render(
      <AppProvider i18n={{}}>
        <Frame>
          <AppSaveBar dirty onSave={onSave} onDiscard={onDiscard} saveLabel="Save" />
        </Frame>
      </AppProvider>
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Save")).toBeInTheDocument());
    expect(document.querySelector('[class*="Polaris-Frame-ContextualSaveBar"]')).toBeInTheDocument();
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
