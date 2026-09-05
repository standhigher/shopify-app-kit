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
      steps={<ol><li>示例初始为 dirty，查看 App Bridge 原生 Save Bar action。</li><li>点击 <strong>Save</strong> 或 <strong>Discard</strong>，状态变为 Saved。</li><li>点击 <strong>Edit draft</strong>，再次进入 dirty 状态。</li></ol>}
      hostRequirements={<p>Embedded App 需要提供 App Bridge Save Bar runtime；该路径不需要引入 Polaris CSS。</p>}
      fallback={<p>没有 adapter 或 adapter 调用失败时不渲染默认 Save Bar；如需非 Embedded 或 Polaris UI，请通过 <code>renderers.saveBar</code> 传入自定义实现。</p>}
      notes={<p>保存失败不应清除 dirty 状态；保存过程中再次编辑时，最新编辑仍应保持为未保存。</p>}
    />
  );
}
