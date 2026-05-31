import { test } from "@playwright/test";
import { AppPage } from "../pages/app-page";
import {
    givenAppIsOpen,
    whenUserOpensSettings,
} from "../steps/app-page-steps";
import {
    thenSettingsDialogIsDisplayed,
    thenVaultPathIsDisplayed,
} from "../steps/settings-steps";

test("opens settings", async ({ page }) => {
    const app = new AppPage(page);

    await givenAppIsOpen(app);
    const settingsDialog = await whenUserOpensSettings(app);
    await thenSettingsDialogIsDisplayed(settingsDialog);
});

test("can view the vault path in settings", async ({ page }) => {
    const app = new AppPage(page);

    await givenAppIsOpen(app);
    const settingsDialog = await whenUserOpensSettings(app);
    await thenSettingsDialogIsDisplayed(settingsDialog);
    await thenVaultPathIsDisplayed(settingsDialog, "/mnt/c/Users/clark/OneDrive/Documents/Steven's Obsidian");
});
