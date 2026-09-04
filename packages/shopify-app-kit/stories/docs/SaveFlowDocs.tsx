import { FeatureDocs } from "./FeatureDocs";

export function SaveFlowDocs() {
  return (
    <FeatureDocs
      summary={<p>AppSaveBar 用于提示未保存更改，并统一处理保存、丢弃、加载和宿主 Save Bar 适配。</p>}
      parameters={<table><thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
        <tr><td><code>dirty</code></td><td><code>boolean</code></td><td>必填</td><td>是否存在未保存更改；为 <code>true</code> 时显示保存栏。</td></tr>
        <tr><td><code>saving</code></td><td><code>boolean</code></td><td><code>false</code></td><td>保存中时禁用操作并显示 loading。</td></tr>
        <tr><td><code>onSave</code> / <code>onDiscard</code></td><td>回调</td><td>必填</td><td>分别处理保存和丢弃。</td></tr>
        <tr><td><code>id</code></td><td><code>string</code></td><td><code>app-kit-save-bar</code></td><td>宿主 Save Bar 的唯一标识。</td></tr>
        <tr><td><code>adapter</code></td><td><code>SaveBarAdapter</code></td><td>—</td><td>显式注入的宿主 Save Bar 能力。</td></tr>
      </tbody></table>}
      steps={<ol><li>示例初始为 dirty，查看 Polaris fallback Save Bar。</li><li>点击 <strong>Save</strong> 或 <strong>Discard</strong>，状态变为 Saved。</li><li>点击 <strong>Edit draft</strong>，再次进入 dirty 状态。</li></ol>}
      hostRequirements={<p>Embedded App 可注入 App Bridge Save Bar adapter；宿主仍需提供 Polaris <code>AppProvider</code>、<code>Frame</code> 和 CSS 作为 fallback。</p>}
      fallback={<p>没有 adapter 或 adapter 调用失败时，自动回退到 Polaris <code>ContextualSaveBar</code>。离开保护只适用于浏览器页面存在 dirty 状态的场景。</p>}
      notes={<p>保存失败不应清除 dirty 状态；保存过程中再次编辑时，最新编辑仍应保持为未保存。</p>}
    />
  );
}
