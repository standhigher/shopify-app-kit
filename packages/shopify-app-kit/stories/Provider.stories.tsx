import type { Meta, StoryObj } from "@storybook/react";
import { ShopifyAppKitProvider, useShopifyAppKit } from "../src/core";
import { ProviderDocs } from "./docs/ProviderDocs";

function Probe() {
  const kit = useShopifyAppKit();
  return <div style={{ padding: 24 }}><h2>{kit.appName}</h2><p>{kit.locale}</p><button>{kit.messages.save}</button></div>;
}

const meta = {
  title: "Provider/ShopifyAppKitProvider",
  component: ShopifyAppKitProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: ProviderDocs,
      description: {
        component: "为 Shopify Embedded App 提供统一的上下文、文案和宿主能力注入。"
      }
    }
  },
  argTypes: {
    appName: { description: "应用名称；必填，用于上下文和默认文案场景。", table: { type: { summary: "string" }, category: "Provider" } },
    locale: { description: "locale，例如 en 或 zh-CN；未匹配的区域 locale 会回退到支持的字典。", table: { type: { summary: "string" }, defaultValue: { summary: "en" }, category: "Provider" } },
    shop: { description: "当前 Shopify shop 域名；由宿主按需提供。", table: { type: { summary: "string" }, category: "Host" } },
    messages: { description: "覆盖 save、discard、confirm 等默认文案。", table: { type: { summary: "AppKitMessageOverrides" }, category: "Customization" } },
    children: { control: false, description: "应用内容。", table: { type: { summary: "ReactNode" }, category: "Provider" } }
  }
} satisfies Meta<typeof ShopifyAppKitProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = { args: { appName: "Fulfillment Desk", children: <Probe /> } };
export const SimplifiedChinese: Story = { args: { appName: "履约工作台", locale: "zh-CN", children: <Probe /> } };
