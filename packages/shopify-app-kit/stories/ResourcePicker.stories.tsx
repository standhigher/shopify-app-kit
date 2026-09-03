import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShopifyAppKitProvider } from "../src/core";
import { useProductPicker } from "../src/resource-picker";
function PickerDemo() { const picker = useProductPicker(); const [result, setResult] = useState("No selection"); return <div style={{ padding: 24 }}><button onClick={async () => { const value = await picker.open({ multiple: true }); setResult(value.canceled ? "Canceled" : value.selection.map((item) => item.title ?? item.id).join(", ")); }}>Pick products</button><p role="status">{result}</p></div>; }
const meta = { title: "Resource Picker/useProductPicker", component: PickerDemo, tags: ["autodocs"] } satisfies Meta<typeof PickerDemo>;
export default meta;
export const HostFallback: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><PickerDemo /></ShopifyAppKitProvider> };
