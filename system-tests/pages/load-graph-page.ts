import type { Locator, Page } from "@playwright/test";

export class LoadGraphDialogPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPage() {
        return this.page;
    }

    isVisible() {
        return this.page.getByRole("dialog", { name: "Load Graph" }).isVisible();
    }

    isNotVisible() {
        return this.page.getByRole("dialog", { name: "Load Graph" }).isHidden();
    }

    loadButton() {
        return this.page.getByRole("button", { name: "Load", exact: true });
    }

    cancelButton() {
        return this.page.getByRole("button", { name: "Cancel" });
    }

    graphCards() {
        return this.page.getByTestId("graph-card");
    }

    graphName(graphCard: Locator) {
        return graphCard.getByTestId("card-graph-name").textContent();
    }
}