import type { Page } from "@playwright/test";
import { SettingsDialogPage } from "./settings-page";
import { NewGraphDialogPage } from "./new-graph-page";

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

    async openNewGraphDialog() {
        await this.page.getByRole("button", { name: "New Graph" }).click();
        return new NewGraphDialogPage(this.page);
    }
}