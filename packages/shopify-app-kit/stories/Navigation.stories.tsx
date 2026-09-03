import type { Meta, StoryObj } from "@storybook/react";
import { useAppNavigation } from "../src/navigation";
function NavigationDemo() { const { navigate, openAdmin, openExternal } = useAppNavigation(); return <div style={{ padding: 24 }}><button onClick={() => void navigate("/settings")}>Navigate app</button> <button onClick={() => void openAdmin("/products")}>Open Admin</button> <button onClick={() => void openExternal("https://shopify.dev")}>Open external</button></div>; }
const meta = { title: "Navigation/useAppNavigation", component: NavigationDemo, tags: ["autodocs"] } satisfies Meta<typeof NavigationDemo>;
export default meta;
export const SafeActions: StoryObj<typeof meta> = { render: () => <NavigationDemo /> };
