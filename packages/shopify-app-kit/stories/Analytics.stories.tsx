import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useAnalytics } from "../src/core";
import { createAnalytics } from "../src/analytics";
import { ShopifyAppKitProvider } from "../src/core";
import { AnalyticsDocs } from "./docs/AnalyticsDocs";
function AnalyticsDemo() { const analytics = useAnalytics(); const [status, setStatus] = useState("Idle"); return <div style={{ padding: 24 }}><button onClick={async () => { const event = { name: "storybook_interaction", attributes: { surface: "analytics" } } as const; const client = createAnalytics({ adapters: [{ track: async () => undefined }] }); await client.track(event); await analytics.track(event); setStatus("Tracked storybook_interaction"); }}>Track event</button><p role="status">{status}</p></div>; }
const meta = {
  title: "Analytics/createAnalytics",
  component: AnalyticsDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: AnalyticsDocs,
      description: {
        component: "通过统一事件模型调用一个或多个 Analytics adapter。"
      }
    }
  }
} satisfies Meta<typeof AnalyticsDemo>;
export default meta;
export const TrackEvent: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><AnalyticsDemo /></ShopifyAppKitProvider> };
