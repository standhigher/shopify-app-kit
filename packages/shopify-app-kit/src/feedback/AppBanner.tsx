import { Banner } from "@shopify/polaris";

export type BannerTone = "info" | "success" | "warning" | "critical";

export interface AppBannerProps {
  tone?: BannerTone;
  title: string;
  children?: React.ReactNode;
}

export function AppBanner({ tone = "info", title, children }: AppBannerProps) {
  return <Banner tone={tone} title={title}>{children}</Banner>;
}
