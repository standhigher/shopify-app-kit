import {
  Controls,
  Description,
  Primary,
  Stories,
  Title
} from "@storybook/blocks";
import type { ReactNode } from "react";

export interface FeatureDocsProps {
  summary: ReactNode;
  parameters: ReactNode;
  steps: ReactNode;
  hostRequirements: ReactNode;
  fallback: ReactNode;
  notes?: ReactNode;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ margin: "2rem 0" }}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function FeatureDocs({
  summary,
  parameters,
  steps,
  hostRequirements,
  fallback,
  notes
}: FeatureDocsProps) {
  return (
    <>
      <Title />
      <Description />
      <Section title="功能简介">{summary}</Section>
      <Section title="参数">{parameters}</Section>
      <Section title="如何操作">{steps}</Section>
      <Section title="宿主要求">{hostRequirements}</Section>
      <Section title="Fallback 与限制">{fallback}</Section>
      {notes ? <Section title="相关说明">{notes}</Section> : null}
      <Section title="交互示例">
        <Primary />
      </Section>
      <Section title="Controls">
        <Controls />
      </Section>
      <Stories title="其他示例" includePrimary={false} />
    </>
  );
}
