import type { Meta, StoryObj } from "@storybook/react";
import { useAppNavigation } from "../src/navigation";
function NavigationDemo() { const { navigate, openAdmin, openExternal } = useAppNavigation(); return <div style={{ padding: 24 }}><button onClick={() => void navigate("/settings")}>Navigate app</button> <button onClick={() => void openAdmin("/products")}>Open Admin</button> <button onClick={() => void openExternal("https://shopify.dev")}>Open external</button></div>; }
const meta = {
  title: "Navigation/useAppNavigation",
  component: NavigationDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "useAppNavigation 提供 navigate(path)、openAdmin(path) 和 openExternal(url, options)。应用内与 Admin 路径必须以单个 / 开头；外部链接仅允许安全协议。宿主 adapter 或 App Bridge 可用时优先使用，否则降级到浏览器导航。",
        story: "Navigate app 打开应用内路径，Open Admin 打开 Shopify Admin 目标，Open external 打开 shopify.dev。"
      }
    }
  }
} satisfies Meta<typeof NavigationDemo>;
export default meta;
export const SafeActions: StoryObj<typeof meta> = { render: () => <NavigationDemo /> };
