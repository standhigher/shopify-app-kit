# Save Flow

`useDirtyForm` manages a clean snapshot, dirty state, save/discard actions, and save errors. It accepts `initialValue`, `value`, optional `onSave`, optional `onDiscard`, and optional `compare`.

`AppSaveBar` uses Shopify App Bridge Save Bar when `window.shopify.saveBar` (or an explicit `saveBar` adapter) is available. Otherwise it renders Polaris `ContextualSaveBar` through the host `Frame`. The package never creates a Polaris `AppProvider` or `Frame` implicitly.

The required composition is:

```tsx
<AppProvider i18n={{}}>
  <Frame>
    <ShopifyAppKitProvider appName="Settings">
      <AppSaveBar dirty={form.dirty} onSave={form.save} onDiscard={form.discard} />
    </ShopifyAppKitProvider>
  </Frame>
</AppProvider>
```

Import `@shopify/polaris/build/esm/styles.css` once in the host application.

`LeaveGuard` registers a `beforeunload` guard while `dirty` is true.

Save behavior:

- `dirty=false` when the current value matches the clean snapshot.
- Successful save updates the clean snapshot.
- Failed save keeps the dirty state and exposes `status="error"`.
- Discard calls the caller's `onDiscard`; callers should reset form state to the clean value.
- When `initialValue` changes to a new record or server snapshot, the clean snapshot and status reset to `idle`.
- If a saved value is edited again, status returns to `dirty`.
