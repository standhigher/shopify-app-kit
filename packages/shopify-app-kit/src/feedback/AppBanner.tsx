export type BannerTone = "info" | "success" | "warning" | "critical";

export interface AppBannerProps {
  tone?: BannerTone;
  title: string;
  children?: React.ReactNode;
}

export function AppBanner({ tone = "info", title, children }: AppBannerProps) {
  const role = tone === "critical" || tone === "warning" ? "alert" : "status";

  return (
    <section role={role} data-tone={tone} aria-label={title}>
      <strong>{title}</strong>
      {children ? <div>{children}</div> : null}
    </section>
  );
}
