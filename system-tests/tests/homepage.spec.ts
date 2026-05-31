import { test, expect } from "@playwright/test";

test("loads the Mind Graph homepage and displays the toolbar title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mind Graph/);
    await expect(page.locator(".toolbar")).toContainText("Mind Graph");
});
