import { FeatureDocs } from "./FeatureDocs";

export function FeedbackDocs() {
  return (
    <FeatureDocs
      summary={<p>Feedback 组件使用 Shopify Polaris 提供 Banner、Modal、Confirm 和 Toast 反馈，保持 Embedded App 的交互与可访问性一致。</p>}
      parameters={<table><thead><tr><th>组件 / 参数</th><th>类型</th><th>说明</th></tr></thead><tbody>
        <tr><td><code>AppBanner.title</code></td><td><code>string</code></td><td>必填的提示标题。</td></tr>
        <tr><td><code>AppBanner.tone</code></td><td><code>info | success | warning | critical</code></td><td>提示语气，默认 <code>info</code>。</td></tr>
        <tr><td><code>AppModal.open</code> / <code>title</code></td><td><code>boolean</code> / <code>string</code></td><td>控制弹窗可见性和可访问名称。</td></tr>
        <tr><td><code>AppModal.onClose</code> / <code>footer</code></td><td>回调 / <code>ReactNode</code></td><td>关闭回调和底部操作区域。</td></tr>
        <tr><td><code>ToastProvider.duration</code> / <code>maxToasts</code> / <code>dedupe</code></td><td><code>number</code> / <code>number</code> / <code>boolean</code></td><td>默认 <code>5000ms</code>、<code>3</code>、<code>false</code>。</td></tr>
      </tbody></table>}
      steps={<ol><li>点击 <strong>Open modal</strong>，查看弹窗、Escape 关闭和 focus restoration。</li><li>点击 <strong>Show toast</strong>，查看 Polaris Toast 反馈。</li></ol>}
      hostRequirements={<p>宿主必须先提供 Polaris <code>AppProvider</code>、<code>Frame</code> 和 CSS；使用 <code>useToast</code> 的内容必须位于 <code>ToastProvider</code> 内。</p>}
      fallback={<p>Feedback 默认使用 Polaris renderer，也可以通过 Provider 的 <code>renderers</code> 替换视觉实现，但应保留关闭、键盘和 ARIA 行为。</p>}
      notes={<p>Modal 支持 Escape、Backdrop 关闭和触发元素焦点恢复；Toast 通过 <code>aria-live</code> 通知状态变化。</p>}
    />
  );
}
