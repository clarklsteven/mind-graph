import test from "@playwright/test";
import type { LoadGraphDialogPage } from "../pages/load-graph-page";

export async function thenLoadGraphDialogIsDisplayed(app: LoadGraphDialogPage) {
    await test.step("Then the Load Graph dialog is displayed", async () => {
        await app.isVisible();
    });
}

export async function thenLoadGraphDialogIsNotDisplayed(app: LoadGraphDialogPage) {
    await test.step("Then the Load Graph dialog is displayed", async () => {
        await app.isNotVisible();
    });
}

export async function whenUserClicksCancel(app: LoadGraphDialogPage) {
    await test.step("When the user clicks the Cancel button", async () => {
        await app.cancelButton().click();
    });
}

export async function whenUserLoadsTheFirstGraph(app: LoadGraphDialogPage) {
    await test.step("When the user loads the first graph", async () => {
        const graphCards = await app.graphCards();
        const card = await graphCards.first()
        await card.click();
        await app.loadButton().click();
    });
}
