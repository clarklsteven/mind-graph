import { describe, it, expect } from 'vitest';
import { UserSettings } from './user-settings';
import path from 'path';
import os from 'os';
import fs from 'fs';

describe('UserSettings', () => {
    it("loads settings from disk", () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mind-graph-"));
        const settingsPath = path.join(tempDir, "settings.json");

        fs.writeFileSync(
            settingsPath,
            JSON.stringify({
                vaultPath: "/test/vault"
            }),
            "utf-8"
        );

        const userSettings = new UserSettings(settingsPath);

        const result = userSettings.getSettings();

        expect(result).toEqual({
            vaultPath: "/test/vault"
        });
    });
});
