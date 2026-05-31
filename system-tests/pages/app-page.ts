import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { SettingsDialogPage } from "./settings-page";

export class AppPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPage() {
        return this.page;
    }

    async open() {
        await this.page.goto("/");
    }

    async openSettings() {
        await this.page.getByRole("button", { name: "Settings" }).click();
        return new SettingsDialogPage(this.page);
    }

    async isSettingsVisible() {
        await expect(
            this.page.getByRole("dialog", { name: "Settings" })
        ).toBeVisible();
    }
}