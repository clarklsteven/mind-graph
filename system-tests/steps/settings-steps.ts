import test, { expect } from "@playwright/test";
import type { SettingsDialogPage } from "../pages/settings-page";

export async function thenSettingsDialogIsDisplayed(app: SettingsDialogPage) {
    await test.step("Then the Settings dialog is displayed", async () => {
        await app.isVisible();
    });
}

export async function thenVaultPathIsDisplayed(app: SettingsDialogPage, expectedPath: string) {
    await test.step(`Then the vault path is displayed as "${expectedPath}"`, async () => {
        const vaultPathInput = app.vaultPathInput();
        await expect(vaultPathInput).toHaveValue(expectedPath);
    });
}