# Resource Picker

`useProductPicker` and `useCollectionPicker` expose adapter-driven resource picking. In an Embedded App they automatically use the App Bridge `window.shopify.resourcePicker` runtime when no explicit adapter is supplied.

```tsx
const picker = useProductPicker();
const result = await picker.open({ multiple: true });
```

The hook returns the adapter result:

```ts
{
  canceled: boolean;
  selection: Array<{ id: string; title?: string; handle?: string; imageUrl?: string }>;
}
```

Phase 1 returns selected resource references only. It does not hydrate business fields or call Admin API endpoints.

When no adapter is configured, hooks return `{ canceled: true, selection: [] }`, which makes local development and examples safe by default.
