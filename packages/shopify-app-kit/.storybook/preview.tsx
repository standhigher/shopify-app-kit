import type { Preview } from "@storybook/react";
import { AppProvider, Frame } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProvider i18n={{}}>
        <Frame><Story /></Frame>
      </AppProvider>
    )
  ],
  parameters: { layout: "fullscreen" }
};

export default preview;
