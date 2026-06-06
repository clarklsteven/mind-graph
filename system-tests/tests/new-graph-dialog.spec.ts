import { test } from "@playwright/test";
import { AppPage } from "../pages/app-page";
import {
    givenAppIsOpen,
    whenUserOpensNewGraphDialog,
} from "../steps/app-page-steps";
import { thenGraphNameIsDisplayed, thenInterpretationIsDisplayed, thenNewGraphDialogIsDisplayed } from "../steps/new-graph-steps";


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
