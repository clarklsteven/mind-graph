import test from "@playwright/test";
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
