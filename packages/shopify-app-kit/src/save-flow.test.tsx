import { AppProvider, Frame } from "@shopify/polaris";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AppSaveBar,
  LeaveGuard,
  useDirtyForm
} from "@standhigher/shopify-app-kit/save-flow";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";

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

  it("does not render a default save bar without a host adapter", () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    render(
      <AppProvider i18n={{}}>
        <Frame>
          <AppSaveBar dirty onSave={onSave} onDiscard={onDiscard} saveLabel="Save" />
        </Frame>
      </AppProvider>
    );

    expect(onSave).not.toHaveBeenCalled();
    expect(onDiscard).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("uses the App Bridge Save Bar adapter and renders native actions", async () => {
    const show = vi.fn();
    const hide = vi.fn();
    const onSave = vi.fn();
    const onDiscard = vi.fn();
    const { rerender, unmount } = render(
      <ShopifyAppKitProvider appName="Demo" saveBar={{ show, hide }}>
        <AppSaveBar dirty id="settings-save" onSave={onSave} onDiscard={onDiscard} />
      </ShopifyAppKitProvider>
    );
    await waitFor(() => expect(show).toHaveBeenCalledWith("settings-save"));
    expect(document.querySelector("ui-save-bar#settings-save")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await userEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onDiscard).toHaveBeenCalledTimes(1);
    rerender(
      <ShopifyAppKitProvider appName="Demo" saveBar={{ show, hide }}>
        <AppSaveBar dirty={false} id="settings-save" onSave={onSave} onDiscard={onDiscard} />
      </ShopifyAppKitProvider>
    );
    await waitFor(() => expect(hide).toHaveBeenCalledWith("settings-save"));
    unmount();
  });

  it("uses a custom renderer when provided without a host adapter", async () => {
    const onSave = vi.fn();
    const show = vi.fn(() => {
      throw new Error("bridge unavailable");
    });
    const CustomSaveBar = ({ onSave: save }: { onSave: () => Promise<void> | void }) => (
      <button onClick={() => void save()}>Custom save</button>
    );
    render(
      <ShopifyAppKitProvider appName="Demo" renderers={{ saveBar: CustomSaveBar }}>
        <AppSaveBar dirty onSave={onSave} onDiscard={vi.fn()} />
      </ShopifyAppKitProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "Custom save" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(show).not.toHaveBeenCalled();
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
