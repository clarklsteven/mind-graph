import type { Page } from "@playwright/test";
import { SettingsDialogPage } from "./settings-page";
import { NewGraphDialogPage } from "./new-graph-page";
import { LoadGraphDialogPage } from "./load-graph-page";
import { ControlPanel } from "./control-panel";

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

    async openLoadGraphDialog() {
        await this.page.getByRole("button", { name: "Load Graph" }).click();
        return new LoadGraphDialogPage(this.page);
    }

    async controlPanel() {
        this.page.getByTestId("control-panel");
        return new ControlPanel(this.page);
    }

}