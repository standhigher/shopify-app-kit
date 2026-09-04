import { FeatureDocs } from "./FeatureDocs";

export function AnalyticsDocs() {
  return (
    <FeatureDocs
      summary={<p>Analytics 通过统一事件模型把业务交互发送给一个或多个 adapter，并支持全局 facade。</p>}
      parameters={<table><thead><tr><th>参数</th><th>类型</th><th>说明</th></tr></thead><tbody>
        <tr><td><code>name</code></td><td><code>string</code></td><td>事件名称，必填。</td></tr>
        <tr><td><code>attributes</code></td><td><code>Record&lt;string, ScalarAttribute&gt;</code></td><td>只允许 string、number、boolean 或 null。</td></tr>
        <tr><td><code>idempotencyKey</code></td><td><code>string</code></td><td><code>billing_event</code> 必填，用于幂等处理。</td></tr>
        <tr><td><code>adapters</code></td><td><code>AnalyticsAdapter[]</code></td><td>多个 adapter 按配置顺序执行。</td></tr>
        <tr><td><code>onError</code></td><td>回调</td><td>接收 adapter 失败信息；最终错误以 AggregateError 暴露。</td></tr>
      </tbody></table>}
      steps={<ol><li>点击 <strong>Track event</strong>。</li><li>观察状态文本变为 <code>Tracked storybook_interaction</code>。</li><li>在真实应用中替换为 Shopify App Events 或自定义 adapter。</li></ol>}
      hostRequirements={<p>Analytics adapter 由宿主注入；如果需要 Shopify App Events，宿主还应提供对应的运行时环境和服务端接收端点。</p>}
      fallback={<p>未初始化全局 analytics 或不存在 Shopify host 时，事件 facade 保持安全 no-op；自定义 adapter 仍可独立工作。</p>}
      notes={<p>useAnalytics 读取 Provider 上下文中的 client；全局 <code>analytics</code> facade 适合无法直接访问 React context 的边界代码。</p>}
    />
  );
}
