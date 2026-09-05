# Save Flow

`useDirtyForm` manages a clean snapshot, dirty state, save/discard actions, and save errors. It accepts `initialValue`, `value`, optional `onSave`, optional `onDiscard`, and optional `compare`.

`AppSaveBar` uses Shopify App Bridge Save Bar by default when `window.shopify.saveBar` (or an explicit `saveBar` adapter) is available. It renders the native `ui-save-bar` element and wires its Save/Discard actions to `onSave` and `onDiscard`; no Polaris CSS is required for this path. If App Bridge is unavailable, the component renders nothing unless the host provides a custom `renderers.saveBar` implementation.

When a `ShopifyAppKitProvider` is present, omitted save/discard labels use its
locale dictionary. The provider's `renderers.saveBar` slot may wrap the default
component through `DefaultComponent`; rendering that default preserves the
native App Bridge save-bar contract when an adapter is available.

The Embedded App composition is:

```tsx
<ShopifyAppKitProvider
  appName="Settings"
  saveBar={createShopifySaveBarAdapter()}
>
  <AppSaveBar dirty={form.dirty} onSave={form.save} onDiscard={form.discard} />
</ShopifyAppKitProvider>
```

For a non-Embedded or custom UI, provide `renderers.saveBar` from the host and
render the desired component yourself. Polaris `AppProvider`, `Frame`, and
CSS are only required if that custom renderer uses Polaris components.

`LeaveGuard` registers a `beforeunload` guard while `dirty` is true.

Save behavior:

- `dirty=false` when the current value matches the clean snapshot.
- Successful save updates the clean snapshot.
- Failed save keeps the dirty state and exposes `status="error"`.
- Discard calls the caller's `onDiscard`; callers should reset form state to the clean value.
- When `initialValue` changes to a new record or server snapshot, the clean snapshot and status reset to `idle`.
- If a saved value is edited again, status returns to `dirty`.
