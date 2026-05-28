import type { UserSettingsInterface } from "../../../server/src/model/user-settings";

export async function getSettings(): Promise<UserSettingsInterface> {
    const response = await fetch("http://localhost:3000/user/settings");
    const data = await response.json();
    return data.settings;
}

export async function updateSettings(newSettings: Partial<UserSettingsInterface>): Promise<void> {
    await fetch("http://localhost:3000/user/settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newSettings)
    });
}

export async function verifyVaultPath(vaultPath: string): Promise<boolean> {
    const response = await fetch("http://localhost:3000/user/settings/verify-vault-path", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ vaultPath })
    });
    const data = await response.json();
    return data.isValid;
}