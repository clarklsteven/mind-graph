import type { Locator } from "@playwright/test";

export class NewGraphDialogPage {

    private dialog: Locator;

    constructor(dialog: Locator) {
        this.dialog = dialog;
    }

    getPage() {
        return this.dialog;
    }

    isVisible() {
        return this.dialog.getByRole("dialog", { name: "Create New Graph" }).isVisible();
    }

    graphNameInput() {
        return this.dialog.getByRole("textbox", { name: "Graph Name" });
    }

    interpretationInput() {
        return this.dialog.getByRole("combobox", { name: "Interpretation" });
    }

    createButton() {
        return this.dialog.getByRole("button", { name: "Create" });
    }

    cancelButton() {
        return this.dialog.getByRole("button", { name: "Cancel" });
    }
}