# Save Flow

`useDirtyForm` manages a clean snapshot, dirty state, save/discard actions, and save errors. It accepts `initialValue`, `value`, optional `onSave`, optional `onDiscard`, and optional `compare`.

`AppSaveBar` uses Shopify App Bridge's native `ui-save-bar` when `window.shopify.saveBar` (or an explicit `saveBar` adapter) is available. The native element includes Save and Discard buttons and does not require the host to import Polaris CSS. If App Bridge is unavailable or its adapter fails, the default Save Bar is not rendered. Supply `renderers.saveBar` when a custom UI or a non-Embedded fallback is required. The package never creates a Polaris `AppProvider` or `Frame` implicitly.

When a `ShopifyAppKitProvider` is present, omitted save/discard labels use its
locale dictionary. The provider's `renderers.saveBar` slot may wrap the default
component through `DefaultComponent`; rendering that default uses the native
App Bridge element when an adapter is available.

The required composition is:

```tsx
<ShopifyAppKitProvider
  appName="Settings"
  saveBar={createShopifySaveBarAdapter()}
>
  <AppSaveBar dirty={form.dirty} onSave={form.save} onDiscard={form.discard} />
</ShopifyAppKitProvider>
```

Feedback components still require the host's Polaris `AppProvider`, `Frame`,
and CSS. Save Flow itself does not require Polaris CSS when App Bridge is
configured.

`LeaveGuard` registers a `beforeunload` guard while `dirty` is true.

Save behavior:

- `dirty=false` when the current value matches the clean snapshot.
- Successful save updates the clean snapshot.
- Failed save keeps the dirty state and exposes `status="error"`.
- Discard calls the caller's `onDiscard`; callers should reset form state to the clean value.
- When `initialValue` changes to a new record or server snapshot, the clean snapshot and status reset to `idle`.
- If a saved value is edited again, status returns to `dirty`.
