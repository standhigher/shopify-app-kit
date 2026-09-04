import { FeatureDocs } from "./FeatureDocs";

export function ProviderDocs() {
  return (
    <FeatureDocs
      summary={<p>ShopifyAppKitProvider 为应用内容提供统一的 locale、默认文案、宿主 adapter 和 renderer 上下文。</p>}
      parameters={<table><thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
        <tr><td><code>appName</code></td><td><code>string</code></td><td>必填</td><td>应用名称，用于上下文和默认文案场景。</td></tr>
        <tr><td><code>locale</code></td><td><code>string</code></td><td><code>en</code></td><td>支持 <code>en</code>、<code>zh-CN</code>；区域 locale 会回退到支持的字典。</td></tr>
        <tr><td><code>shop</code></td><td><code>string</code></td><td>—</td><td>当前 Shopify shop 域名，由宿主按需提供。</td></tr>
        <tr><td><code>messages</code></td><td><code>AppKitMessageOverrides</code></td><td>—</td><td>覆盖保存、丢弃、确认等默认文案。</td></tr>
        <tr><td><code>analytics</code> / adapter</td><td><code>AnalyticsClient</code></td><td>—</td><td>注入宿主的事件上报能力。</td></tr>
        <tr><td><code>navigation</code>、<code>saveBar</code>、<code>resourcePicker</code></td><td>adapter</td><td>—</td><td>注入 Shopify App Bridge 或自定义宿主能力。</td></tr>
        <tr><td><code>renderers</code></td><td><code>AppKitRenderers</code></td><td>—</td><td>替换 Banner、Modal、Toast、Save Bar 的渲染实现。</td></tr>
      </tbody></table>}
      steps={<ol><li>通过 Controls 修改 <code>appName</code> 或 <code>locale</code>。</li><li>观察 Canvas 中的上下文值和本地化文案变化。</li></ol>}
      hostRequirements={<p>宿主负责安装并提供 Polaris <code>AppProvider</code>、<code>Frame</code> 和 CSS。Provider 不会重复创建 Polaris context，也不会打包 Polaris。</p>}
      fallback={<p>未提供 adapter 时，依赖宿主能力的功能会使用各自的安全 fallback；未匹配的 locale 回退到支持的语言字典。</p>}
      notes={<p>推荐将 <code>ShopifyAppKitProvider</code> 放在路由和业务页面的共同祖先位置，并在需要 Toast 的区域内嵌套 <code>ToastProvider</code>。</p>}
    />
  );
}
