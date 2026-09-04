import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppSaveBar } from "../src/save-flow";
import { SaveFlowDocs } from "./docs/SaveFlowDocs";

function SaveDemo() { const [dirty, setDirty] = useState(true); return <div style={{ padding: 24 }}><p>Change the draft, then save or discard.</p><button onClick={() => setDirty(true)}>Edit draft</button><AppSaveBar dirty={dirty} onSave={() => setDirty(false)} onDiscard={() => setDirty(false)} />{!dirty ? <p role="status">Saved</p> : null}</div>; }
const meta = {
  title: "Save Flow/AppSaveBar",
  component: SaveDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: SaveFlowDocs,
      description: {
        component: "统一处理未保存更改、保存、丢弃和宿主 Save Bar 适配。"
      }
    }
  }
} satisfies Meta<typeof SaveDemo>;
export default meta;
export const DirtyDraft: StoryObj<typeof meta> = { render: () => <SaveDemo /> };
