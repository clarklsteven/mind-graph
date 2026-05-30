import { describe, it, expect } from 'vitest';
import { UserSettings } from './user-settings';
import path from 'path';
import os from 'os';
import fs from 'fs';

describe('UserSettings', () => {
    it('loads settings from disk', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mind-graph-'));
        const settingsPath = path.join(tempDir, 'settings.json');

        fs.writeFileSync(
            settingsPath,
            JSON.stringify({
                vaultPath: '/test/vault'
            }),
            'utf-8'
        );

        const userSettings = new UserSettings(settingsPath);

        const result = userSettings.getSettings();

        expect(result).toEqual({
            vaultPath: '/test/vault'
        });
    });

    it('updates and persists new settings', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mind-graph-'));
        const settingsPath = path.join(tempDir, 'settings.json');

        fs.writeFileSync(
            settingsPath,
            JSON.stringify({
                vaultPath: '/initial/vault'
            }),
            'utf-8'
        );

        const userSettings = new UserSettings(settingsPath);
        userSettings.updateSettings({ vaultPath: '/updated/vault' });

        const result = userSettings.getSettings();

        expect(result).toEqual({
            vaultPath: '/updated/vault'
        });
    });

    it('verifies a valid vault path', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mind-graph-vault-'));
        const obsidianDir = path.join(tempDir, '.obsidian');
        fs.mkdirSync(obsidianDir, { recursive: true });

        const userSettings = new UserSettings(path.join(tempDir, 'settings.json'));

        expect(userSettings.verifyVaultPath(tempDir)).toBe(true);
    });
});
