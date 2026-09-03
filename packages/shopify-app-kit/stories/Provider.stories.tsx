import type { Meta, StoryObj } from "@storybook/react";
import { ShopifyAppKitProvider, useShopifyAppKit } from "../src/core";

function Probe() {
  const kit = useShopifyAppKit();
  return <div style={{ padding: 24 }}><h2>{kit.appName}</h2><p>{kit.locale}</p><button>{kit.messages.save}</button></div>;
}

const meta = { title: "Provider/ShopifyAppKitProvider", component: ShopifyAppKitProvider, tags: ["autodocs"] } satisfies Meta<typeof ShopifyAppKitProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = { args: { appName: "Fulfillment Desk", children: <Probe /> } };
export const SimplifiedChinese: Story = { args: { appName: "履约工作台", locale: "zh-CN", children: <Probe /> } };
