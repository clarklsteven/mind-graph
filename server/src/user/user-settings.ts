import fs from "fs";
import type { UserSettingsInterface } from "../model/user-settings";

export class UserSettings {
    private settingsPath: string = "/home/slc/.mind-graph/settings.json";
    private settings: UserSettingsInterface;

    constructor(settingsPath?: string) {
        if (settingsPath) {
            this.settingsPath = settingsPath;
        }
        this.settings = {
            vaultPath: undefined
        };
    }

    getSettings(): UserSettingsInterface {
        const settingsData = fs.readFileSync(this.settingsPath, "utf-8");
        this.settings = JSON.parse(settingsData);
        return this.settings;
    }

    updateSettings(newSettings: Partial<UserSettingsInterface>): void {
        this.getSettings(); // Just in case it's not already been loaded
        this.settings = { ...this.settings, ...newSettings };
        fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2), "utf-8");
    }

    verifyVaultPath(path: string): boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory() && fs.existsSync(`${path}/.obsidian`) && fs.lstatSync(`${path}/.obsidian`).isDirectory();
    }
}