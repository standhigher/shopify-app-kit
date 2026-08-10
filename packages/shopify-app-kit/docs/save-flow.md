# Save Flow

`useDirtyForm` manages a clean snapshot, dirty state, save/discard actions, and save errors. It accepts `initialValue`, `value`, optional `onSave`, optional `onDiscard`, and optional `compare`.

`AppSaveBar` renders a non-embedded fallback action bar. Business apps may replace it with a Shopify App Bridge adapter later, but Phase 1 never assumes App Bridge is available at import time.

`LeaveGuard` registers a `beforeunload` guard while `dirty` is true.

Save behavior:

- `dirty=false` when the current value matches the clean snapshot.
- Successful save updates the clean snapshot.
- Failed save keeps the dirty state and exposes `status="error"`.
- Discard calls the caller's `onDiscard`; callers should reset form state to the clean value.
