import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { AppBanner, AppModal, ToastProvider, useToast } from "../src/feedback";
import { ShopifyAppKitProvider } from "../src/core";

function FeedbackDemo() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return <div style={{ padding: 24 }}><AppBanner title="Inventory sync" tone="success">Everything is up to date.</AppBanner><p><button onClick={() => setOpen(true)}>Open modal</button> <button onClick={() => toast.success("Saved")}>Show toast</button></p><AppModal open={open} title="Accessible settings" onClose={() => setOpen(false)}><p>Escape, backdrop click, and focus restoration are supported.</p></AppModal></div>;
}

const meta = {
  title: "Feedback/Polaris Feedback",
  component: FeedbackDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Feedback 默认渲染 Shopify Polaris 组件。AppBanner 接收 title、tone 和 children；AppModal 接收 open、title、footer、onClose；ToastProvider 接收 duration（默认 5000ms）、maxToasts（默认 3）和 dedupe（默认 false）。需要宿主先提供 Polaris AppProvider、Frame 和 CSS。",
        story: "点击 Open modal 查看 Escape、Backdrop 和 focus restoration；点击 Show toast 查看 Polaris Toast。ToastProvider 必须包裹使用 useToast 的内容。"
      }
    }
  }
} satisfies Meta<typeof FeedbackDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = { render: () => <ShopifyAppKitProvider appName="Demo"><ToastProvider><FeedbackDemo /></ToastProvider></ShopifyAppKitProvider>, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("button", { name: "Show toast" })); await expect(canvas.getByText("Saved")).toBeInTheDocument(); } };
