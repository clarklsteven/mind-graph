import test, { expect } from "@playwright/test";
import type { NewGraphDialogPage } from "../pages/new-graph-page";
import { GraphTestHelper } from "../utils/graph-test-helper";

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

export async function whenUserCreatesANewGraph(app: NewGraphDialogPage, newGraphName: string) {
    await test.step(`When the user creates a new graph: "${newGraphName}"`, async () => {
        const graphNameInput = app.graphNameInput();
        await graphNameInput.fill(newGraphName);
        const createButton = app.createButton();
        await createButton.click();
    });
}

export async function thenTheNewGraphFileExists(newGraphName: string) {
    const gth = new GraphTestHelper();
    const normalisedGraphName = gth.normaliseName(newGraphName);
    await test.step(`Then the new graph file exists: ${normalisedGraphName}.json`, async () => {
        const exists = await gth.graphExists(`${normalisedGraphName}.json`);
        expect(exists).toBeTruthy();
    });
}

export async function theGraphIsAMindMap(newGraphName: string) {
    const gth = new GraphTestHelper();
    const normalisedGraphName = gth.normaliseName(newGraphName);
    await test.step(`Then the graph ${normalisedGraphName} is a mind map`, async () => {
        const graphData = await gth.getGraph(normalisedGraphName);
        expect(graphData?.interpretation).toBe('mind-map-graph');
    });
}

export async function whenTheUserSelectsAMindMapInterpretation(app: NewGraphDialogPage) {
    const interpretationDropdown = app.interpretationInput();
    await interpretationDropdown.selectOption("mind-map-graph");
}