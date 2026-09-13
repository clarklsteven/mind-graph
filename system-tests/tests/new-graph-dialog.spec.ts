import { test } from "@playwright/test";
import { AppPage } from "../pages/app-page";
import {
    givenAppIsOpen,
    thenTheCurrentLoadedGraphNameIs,
    whenUserOpensNewGraphDialog,
} from "../steps/app-page-steps";
import {
    theGraphIsAMindMap,
    thenGraphNameIsDisplayed,
    thenInterpretationIsDisplayed,
    thenNewGraphDialogIsDisplayed,
    thenTheNewGraphFileExists,
    whenTheUserSelectsAMindMapInterpretation,
    whenUserCreatesANewGraph
} from "../steps/new-graph-steps";
import { GraphTestHelper } from "../utils/graph-test-helper";

test.describe("Graph Creation", () => {
    let createdGraphName: string | undefined;
    const graphTestHelper: GraphTestHelper = new GraphTestHelper();

    test.afterEach(async () => {
        if (createdGraphName) {
            await graphTestHelper.deleteGraph(createdGraphName);
            createdGraphName = undefined;
        }
    });
    test("opens new graph dialog", async ({ page }) => {
        const app = new AppPage(page);

        await givenAppIsOpen(app);
        const newGraphDialog = await whenUserOpensNewGraphDialog(app);
        await thenNewGraphDialogIsDisplayed(newGraphDialog);
    });

    test("displays correct graph name and interpretation in new graph dialog", async ({ page }) => {
        const app = new AppPage(page);
        const expectedGraphName = "Untitled Graph";
        const expectedInterpretation = "thinking-graph";

        await givenAppIsOpen(app);
        const newGraphDialog = await whenUserOpensNewGraphDialog(app);
        await thenNewGraphDialogIsDisplayed(newGraphDialog);
        await thenGraphNameIsDisplayed(newGraphDialog, expectedGraphName);
        await thenInterpretationIsDisplayed(newGraphDialog, expectedInterpretation);
    });

    test("creates a new graph", async ({ page }) => {
        const app = new AppPage(page);
        const now = new Date();
        const newGraphName = "New Graph " + now.getFullYear() + now.getMonth() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
        createdGraphName = newGraphName;

        await givenAppIsOpen(app);
        const newGraphDialog = await whenUserOpensNewGraphDialog(app);
        await thenNewGraphDialogIsDisplayed(newGraphDialog);
        await whenUserCreatesANewGraph(newGraphDialog, newGraphName);
        await thenTheCurrentLoadedGraphNameIs(app, newGraphName);
        await thenTheNewGraphFileExists(newGraphName);
    });

    test("creates a new mind map graph", async ({ page }) => {
        const app = new AppPage(page);
        const now = new Date();
        const newGraphName = "Mind Map " + now.getFullYear() + now.getMonth() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
        createdGraphName = newGraphName;

        await givenAppIsOpen(app);
        const newGraphDialog = await whenUserOpensNewGraphDialog(app);
        await thenNewGraphDialogIsDisplayed(newGraphDialog);
        await whenTheUserSelectsAMindMapInterpretation(newGraphDialog)
        await whenUserCreatesANewGraph(newGraphDialog, newGraphName);
        await thenTheCurrentLoadedGraphNameIs(app, newGraphName);
        await thenTheNewGraphFileExists(newGraphName);
        await theGraphIsAMindMap(newGraphName);
    });
});