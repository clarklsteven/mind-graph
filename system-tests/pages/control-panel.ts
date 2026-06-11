import type { Page } from "@playwright/test";

export class ControlPanel {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPage() {
        return this.page;
    }

    currentLoadedGraph() {
        return this.page.getByTestId("graph-name").innerText();
    }
}