import type { Page } from "@playwright/test";

export class SettingsDialogPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPage() {
        return this.page;
    }

    isVisible() {
        return this.page.getByRole("dialog", { name: "Settings" }).isVisible();
    }

    vaultPathInput() {
        return this.page.getByRole("textbox", { name: "Vault Path" });
    }
}