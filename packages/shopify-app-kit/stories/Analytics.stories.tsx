import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useAnalytics } from "../src/core";
import { createAnalytics } from "../src/analytics";
import { ShopifyAppKitProvider } from "../src/core";
function AnalyticsDemo() { const analytics = useAnalytics(); const [status, setStatus] = useState("Idle"); return <div style={{ padding: 24 }}><button onClick={async () => { const event = { name: "storybook_interaction", attributes: { surface: "analytics" } } as const; const client = createAnalytics({ adapters: [{ track: async () => undefined }] }); await client.track(event); await analytics.track(event); setStatus("Tracked storybook_interaction"); }}>Track event</button><p role="status">{status}</p></div>; }
const meta = {
  title: "Analytics/createAnalytics",
  component: AnalyticsDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "createAnalytics({ adapters, onError }) 创建 analytics client。事件必须包含 name，attributes 只允许 string、number、boolean 或 null；billing_event 还必须提供 idempotencyKey。多个 adapter 按顺序执行，失败会通过 onError 暴露并最终抛出 AggregateError。",
        story: "点击 Track event 查看事件成功状态。示例同时演示本地 adapter 和 Provider 中的 useAnalytics。"
      }
    }
  }
} satisfies Meta<typeof AnalyticsDemo>;
export default meta;
export const TrackEvent: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><AnalyticsDemo /></ShopifyAppKitProvider> };
