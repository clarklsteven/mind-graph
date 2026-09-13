import type { Locator } from "@playwright/test";

export class ControlPanel {

    private panel: Locator;

    constructor(panel: Locator) {
        this.panel = panel;
    }

    getPage() {
        return this.panel;
    }

    currentLoadedGraph() {
        return this.panel.getByTestId("graph-name").innerText();
    }
}