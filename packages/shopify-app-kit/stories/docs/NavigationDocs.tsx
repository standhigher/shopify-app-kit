import { FeatureDocs } from "./FeatureDocs";

export function NavigationDocs() {
  return (
    <FeatureDocs
      summary={<p>useAppNavigation 统一处理应用内路径、Shopify Admin 目标和外部 HTTPS 链接。</p>}
      parameters={<table><thead><tr><th>方法</th><th>参数</th><th>说明</th></tr></thead><tbody>
        <tr><td><code>navigate</code></td><td><code>path: string</code></td><td>应用内路径，应以单个 <code>/</code> 开头。</td></tr>
        <tr><td><code>openAdmin</code></td><td><code>path: string</code></td><td>Shopify Admin 相对目标，不接受不安全协议或任意外部 URL。</td></tr>
        <tr><td><code>openExternal</code></td><td><code>url, options?</code></td><td>仅允许安全协议；可配置新窗口和确认回调。</td></tr>
      </tbody></table>}
      steps={<ol><li>点击 <strong>Navigate app</strong> 测试应用内路径。</li><li>点击 <strong>Open Admin</strong> 测试 Admin 目标。</li><li>点击 <strong>Open external</strong> 测试外部 HTTPS URL。</li></ol>}
      hostRequirements={<p>在 Embedded App 中建议注入 App Bridge navigation adapter；宿主同时负责 Polaris <code>AppProvider</code>、<code>Frame</code> 和 CSS。</p>}
      fallback={<p>没有 App Bridge 或 navigation adapter 时，应用内和外部导航降级到浏览器 API；非法路径或不安全 URL 会被拒绝。</p>}
      notes={<p>Admin 目标应由业务应用生成相对 Shopify Admin 的路径，避免将任意外部地址当作 Admin 目标传入。</p>}
    />
  );
}
