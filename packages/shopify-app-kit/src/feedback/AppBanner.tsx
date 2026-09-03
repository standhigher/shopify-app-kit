import { Banner } from "@shopify/polaris";
import { useContext } from "react";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";

export type BannerTone = "info" | "success" | "warning" | "critical";

export interface AppBannerProps {
  tone?: BannerTone;
  title: string;
  children?: React.ReactNode;
}

export function AppBanner({ tone = "info", title, children }: AppBannerProps) {
  const CustomRenderer = useContext(ShopifyAppKitContext)?.renderers?.banner;
  const DefaultBanner = (props: AppBannerProps) => (
    <Banner {...props}>{props.children}</Banner>
  );
  if (CustomRenderer) {
    return <CustomRenderer DefaultComponent={DefaultBanner} tone={tone} title={title}>{children}</CustomRenderer>;
  }
  return <Banner tone={tone} title={title}>{children}</Banner>;
}
