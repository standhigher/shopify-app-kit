import type { Meta, StoryObj } from "@storybook/react";
import { useAppNavigation } from "../src/navigation";
import { NavigationDocs } from "./docs/NavigationDocs";
function NavigationDemo() { const { navigate, openAdmin, openExternal } = useAppNavigation(); return <div style={{ padding: 24 }}><button onClick={() => void navigate("/settings")}>Navigate app</button> <button onClick={() => void openAdmin("/products")}>Open Admin</button> <button onClick={() => void openExternal("https://shopify.dev")}>Open external</button></div>; }
const meta = {
  title: "Navigation/useAppNavigation",
  component: NavigationDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: NavigationDocs,
      description: {
        component: "统一处理应用内、Shopify Admin 和外部 HTTPS 导航。"
      }
    }
  }
} satisfies Meta<typeof NavigationDemo>;
export default meta;
export const SafeActions: StoryObj<typeof meta> = { render: () => <NavigationDemo /> };
