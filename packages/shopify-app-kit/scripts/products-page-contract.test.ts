import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(__dirname, "..");
const repositoryRoot = resolve(packageRoot, "..", "..");
const productsPage = readFileSync(resolve(packageRoot, "public/products/index.html"), "utf8");
const readmes = [
  readFileSync(resolve(repositoryRoot, "README.md"), "utf8"),
  readFileSync(resolve(packageRoot, "README.md"), "utf8")
];

const productsUrl =
  "https://standhigher.github.io/shopify-app-kit/products/?utm_source=GitHub&utm_medium=social&utm_content=standhigher-shopify-app-kit";

const products = [
  { name: "BestTrack Order Tracking", slug: "besttrack", asset: "besttrack.png" },
  { name: "Bestreach: Email&SMS Marketing", slug: "bestreach-email-sms-marketing", asset: "bestreach.jpeg" },
  { name: "BestUpsell", slug: "bestupsellapp", asset: "bestupsell.png" },
  { name: "BestFeed AI", slug: "bestfeed", asset: "bestfeed.png" },
  { name: "BestSourcing AI Inventory", slug: "bestsourcing", asset: "bestsourcing.png" },
  { name: "Bestros", slug: "bestros", asset: "bestros.jpeg" },
  { name: "BestBundle: AI Bundles", slug: "bestbundle", asset: "bestbundle.png" },
  { name: "SonarFulfill Easy Dropshipping", slug: "sonarfulfill", asset: "sonarfulfill.png" }
];

describe("standhigher Products page contract", () => {
  it("links both published and repository README files to the package-attributed Products page", () => {
    for (const readme of readmes) {
      expect(readme).toContain("## Built by standhigher");
      expect(readme).toContain(productsUrl);
    }
  });

  it.each(products)("publishes $name with its official logo and fixed App Store URL", ({ name, slug, asset }) => {
    const appStoreUrl = `https://apps.shopify.com/${slug}?utm_source=GitHub&utm_medium=social`;

    for (const readme of readmes) {
      expect(readme).toContain(`[${name}](${appStoreUrl})`);
    }

    expect(productsPage).toContain(`src="assets/${asset}"`);
    expect(productsPage).toContain(`alt="${name.replaceAll("&", "&amp;")} logo"`);
    expect(existsSync(resolve(packageRoot, "public/products/assets", asset))).toBe(true);
    expect(productsPage).toContain(appStoreUrl.replaceAll("&", "&amp;"));
  });

  it("keeps App Store links fixed in markup and only propagates valid package attribution at runtime", () => {
    expect(productsPage).not.toContain("utm_content=");
    expect(productsPage).toContain('document.querySelectorAll("[data-product]")');
    expect(productsPage).toContain('destination.searchParams.set("utm_content", content)');
  });
});
