import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ShopifyAppKitProvider,
  useAnalytics,
  useShopifyAppKit
} from "@standhigher/shopify-app-kit/core";

function ContextProbe() {
  const kit = useShopifyAppKit();

  return (
    <dl>
      <dt>app</dt>
      <dd>{kit.appName}</dd>
      <dt>locale</dt>
      <dd>{kit.locale}</dd>
      <dt>shop</dt>
      <dd>{kit.shop}</dd>
      <dt>save</dt>
      <dd>{kit.messages.save}</dd>
    </dl>
  );
}

describe("core provider", () => {
  it("provides a typed analytics client through the provider hook", () => {
    const track = () => Promise.resolve();
    function AnalyticsProbe() {
      return <span>{useAnalytics().track === track ? "custom" : "other"}</span>;
    }

    render(
      <ShopifyAppKitProvider appName="Demo" analytics={{ track }}>
        <AnalyticsProbe />
      </ShopifyAppKitProvider>
    );

    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("provides defaults and caller overrides", () => {
    render(
      <ShopifyAppKitProvider
        appName="Fulfillment Desk"
        shop="demo.myshopify.com"
        locale="en-US"
        messages={{ save: "Apply changes" }}
      >
        <ContextProbe />
      </ShopifyAppKitProvider>
    );

    expect(screen.getByText("Fulfillment Desk")).toBeInTheDocument();
    expect(screen.getByText("en-US")).toBeInTheDocument();
    expect(screen.getByText("demo.myshopify.com")).toBeInTheDocument();
    expect(screen.getByText("Apply changes")).toBeInTheDocument();
  });

  it("throws a clear error outside ShopifyAppKitProvider", () => {
    expect(() => render(<ContextProbe />)).toThrow(/ShopifyAppKitProvider/);
  });
});
