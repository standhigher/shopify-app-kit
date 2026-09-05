import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Controls, Description, Title } from "@storybook/blocks";
import { ShopifyAppKitProvider } from "../src/core";
import { useProductPicker } from "../src/resource-picker";

function PickerDemo() {
  const picker = useProductPicker();
  const [result, setResult] = useState("No selection");
  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={async () => {
          const value = await picker.open({ multiple: true });
          setResult(value.canceled ? "Canceled" : value.selection.map((item) => item.title ?? item.id).join(", "));
        }}
      >
        Pick products
      </button>
      <p role="status">{result}</p>
    </div>
  );
}

function ResourcePickerDocsPage() {
  return (
    <>
      <Title />
      <Description />

      <h2>功能简介</h2>
      <p>
        <code>useProductPicker</code> 用于在 Shopify Embedded App 中打开原生资源选择器，返回统一的选择结果结构。
        默认会优先使用宿主提供的 App Bridge picker；在没有宿主能力时返回稳定的 canceled 结果，方便本地开发和测试。
      </p>

      <h2>参数</h2>
      <Controls />

      <h2>如何操作</h2>
      <ol>
        <li>
          在 <code>ShopifyAppKitProvider</code> 中使用 <code>useProductPicker</code>。
        </li>
        <li>
          调用 <code>picker.open({"{ multiple: true }"})</code> 打开产品选择器。
        </li>
        <li>
          根据返回的 <code>canceled</code> 和 <code>selection</code> 更新业务状态。
        </li>
      </ol>

      <h2>宿主要求</h2>
      <p>
        真实 Embedded App 需要宿主注入 App Bridge 能力。接入 Polaris 仍然由宿主负责，Kit 不会隐式创建 Polaris Provider 或引入
        样式。
      </p>

      <h2>Fallback 与限制</h2>
      <p>
        当宿主能力缺失或资源选择器不可用时，默认返回 <code>canceled: true</code> 与空 <code>selection</code>。
        如果业务需要自定义兜底 UI，可以在宿主侧提供相应的扩展，或直接包裹自己的交互层。
      </p>
    </>
  );
}

const meta = {
  title: "Resource Picker/useProductPicker",
  component: PickerDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: ResourcePickerDocsPage,
      description: {
        component: "useProductPicker().open(options) 接收 multiple、selectionIds 和 filter。返回 PickerResult，包含 canceled 和 selection；没有 Product Picker adapter 时返回 canceled: true 与空 selection。真实 Embedded App 需要宿主提供 App Bridge 或自定义 resourcePicker adapter。",
        story: "点击 Pick products 查看 host-free fallback。接入真实 adapter 后，multiple、selectionIds 和 filter 会传递给宿主 picker。"
      }
    }
  },
} satisfies Meta<typeof PickerDemo>;
export default meta;
export const HostFallback: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><PickerDemo /></ShopifyAppKitProvider> };
