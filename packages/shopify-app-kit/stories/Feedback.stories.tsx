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

const meta = { title: "Feedback/Polaris Feedback", component: FeedbackDemo, tags: ["autodocs"] } satisfies Meta<typeof FeedbackDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = { render: () => <ShopifyAppKitProvider appName="Demo"><ToastProvider><FeedbackDemo /></ToastProvider></ShopifyAppKitProvider>, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("button", { name: "Show toast" })); await expect(canvas.getByText("Saved")).toBeInTheDocument(); } };
