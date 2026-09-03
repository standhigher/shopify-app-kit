import { expect, test } from "@playwright/test";

test("feedback story renders Polaris UI and supports modal and toast interactions", async ({ page }) => {
  await page.goto("/iframe.html?id=feedback-polaris-feedback--interactive&viewMode=story");
  await expect(page.locator('[class*="Polaris-Banner"]').first()).toBeVisible();

  await page.getByRole("button", { name: "Open modal" }).click();
  await expect(page.getByRole("dialog", { name: "Accessible settings" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Accessible settings" })).toBeHidden();

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Saved")).toBeVisible();
});

test("save flow story renders the Polaris fallback save bar", async ({ page }) => {
  await page.goto("/iframe.html?id=save-flow-appsavebar--dirty-draft&viewMode=story");
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Discard" })).toBeVisible();
});

test("analytics and picker stories respond in a host-free environment", async ({ page }) => {
  await page.goto("/iframe.html?id=analytics-createanalytics--track-event&viewMode=story");
  await page.getByRole("button", { name: "Track event" }).click();
  await expect(page.getByRole("status")).toHaveText("Tracked storybook_interaction");

  await page.goto("/iframe.html?id=resource-picker-useproductpicker--host-fallback&viewMode=story");
  await page.getByRole("button", { name: "Pick products" }).click();
  await expect(page.getByRole("status")).toHaveText("Canceled");
});
