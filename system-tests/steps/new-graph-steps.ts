import test, { expect } from "@playwright/test";
import type { NewGraphDialogPage } from "../pages/new-graph-page";

export async function thenNewGraphDialogIsDisplayed(app: NewGraphDialogPage) {
    await test.step("Then the New Graph dialog is displayed", async () => {
        await app.isVisible();
    });
}

export async function thenGraphNameIsDisplayed(app: NewGraphDialogPage, expectedName: string) {
    await test.step(`Then the graph name is displayed as "${expectedName}"`, async () => {
        const graphNameInput = app.graphNameInput();
        await expect(graphNameInput).toHaveValue(expectedName);
    });
}

export async function thenInterpretationIsDisplayed(app: NewGraphDialogPage, expectedInterpretation: string) {
    await test.step(`Then the interpretation is displayed as "${expectedInterpretation}"`, async () => {
        const interpretationInput = app.interpretationInput();
        await expect(interpretationInput).toHaveValue(expectedInterpretation);
    });
}