import type { Page } from "@playwright/test";

export class NewGraphDialogPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPage() {
        return this.page;
    }

    isVisible() {
        return this.page.getByRole("dialog", { name: "Create New Graph" }).isVisible();
    }

    graphNameInput() {
        return this.page.getByRole("textbox", { name: "Graph Name" });
    }

    interpretationInput() {
        return this.page.getByRole("combobox", { name: "Interpretation" });
    }

    createButton() {
        return this.page.getByRole("button", { name: "Create" });
    }

    cancelButton() {
        return this.page.getByRole("button", { name: "Cancel" });
    }
}