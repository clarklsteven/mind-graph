import { expect, test } from "@playwright/test";
import { AppPage } from "../pages/app-page";
import {
    givenAppIsOpen,
    thenTheCurrentLoadedGraphNameIs,
    whenUserOpensLoadGraphDialog,
} from "../steps/app-page-steps";
import {
    thenLoadGraphDialogIsDisplayed,
    whenUserClicksCancel,
    thenLoadGraphDialogIsNotDisplayed,
    whenUserLoadsTheFirstGraph
} from "../steps/load-graph-steps";

test("opens the load graph dialog", async ({ page }) => {
    const app = new AppPage(page);

    await givenAppIsOpen(app);
    const loadGraphDialog = await whenUserOpensLoadGraphDialog(app);
    await thenLoadGraphDialogIsDisplayed(loadGraphDialog);
});

test("cancel closes the load graph dialog", async ({ page }) => {
    const app = new AppPage(page);

    await givenAppIsOpen(app);
    const loadGraphDialog = await whenUserOpensLoadGraphDialog(app);
    await thenLoadGraphDialogIsDisplayed(loadGraphDialog);
    await whenUserClicksCancel(loadGraphDialog);
    await thenLoadGraphDialogIsNotDisplayed(loadGraphDialog);
});

test("load an existing graph", async ({ page }) => {
    const app = new AppPage(page);

    await givenAppIsOpen(app);
    const loadGraphDialog = await whenUserOpensLoadGraphDialog(app);
    await expect(loadGraphDialog.graphCards().first()).toBeVisible();
    const graphCards = await loadGraphDialog.graphCards();
    const count = await graphCards.count();
    expect(count).toBeGreaterThan(1);
    const graphName = await loadGraphDialog.graphName(graphCards.first());
    await whenUserLoadsTheFirstGraph(loadGraphDialog);
    await thenLoadGraphDialogIsNotDisplayed(loadGraphDialog);
    await thenTheCurrentLoadedGraphNameIs(app, graphName!);
});
