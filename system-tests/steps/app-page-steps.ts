import test, { expect } from "@playwright/test";
import type { AppPage } from "../pages/app-page";

export async function givenAppIsOpen(app: AppPage) {
    await test.step("Given the app is open", async () => {
        await app.open();
    });
}

export async function whenUserOpensSettings(app: AppPage) {
    return await test.step("When the user opens Settings", async () => {
        return await app.openSettings();
    });
}

export async function whenUserOpensNewGraphDialog(app: AppPage) {
    return await test.step("When the user opens the New Graph dialog", async () => {
        return await app.openNewGraphDialog();
    });
}

export async function whenUserOpensLoadGraphDialog(app: AppPage) {
    return await test.step("When the user opens the Load Graph dialog", async () => {
        return await app.openLoadGraphDialog();
    });
}

function normaliseName(name: string): string {
    const normalisedName = name.replace("-", " ");
    return normalisedName;
}

export async function thenTheCurrentLoadedGraphNameIs(app: AppPage, name: string) {
    return await test.step(`Then the current loaded graph name is ${name}`, async () => {
        await expect(app.getPage().getByTestId("control-panel").getByTestId("graph-name")).not.toHaveText("Untitled Graph");
        const normalisedName = normaliseName(name);
        const controlPanel = await app.controlPanel();
        const graphName = await controlPanel.currentLoadedGraph();
        const normalisedGraphName = normaliseName(graphName);
        expect(normalisedGraphName).toBe(normalisedName);
    });
} 
