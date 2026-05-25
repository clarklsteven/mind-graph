import fs from "fs";

export class UserSettings {
    private settings;

    constructor() {
        this.settings = {};
    }

    getSettings(): any {
        let settingsData = fs.readFileSync("/home/slc/.mind-graph/settings.json", "utf-8");
        this.settings = JSON.parse(settingsData);
        return this.settings;
    }

    updateSettings(newSettings: any): void {
        this.getSettings(); // Just in case it's not already been loaded
        this.settings = { ...this.settings, ...newSettings };
        fs.writeFileSync("/home/slc/.mind-graph/settings.json", JSON.stringify(this.settings, null, 2), "utf-8");
    }

    verifyVaultPath(path: string): boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory() && fs.existsSync(`${path}/.obsidian`) && fs.lstatSync(`${path}/.obsidian`).isDirectory();
    }
}