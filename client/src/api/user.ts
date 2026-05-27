export async function getSettings(): Promise<any> {
    const response = await fetch("http://localhost:3000/user/settings");
    const data = await response.json();
    return data.settings;
}

export async function updateSettings(newSettings: any): Promise<void> {
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