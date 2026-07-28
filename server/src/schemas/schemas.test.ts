import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Schemas } from './schemas';
import { UserSettings } from '../user/user-settings';

describe('Schemas', () => {
    let tempDir: string;
    let schemaService: Schemas;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mind-graph-schemas-'));
        schemaService = new Schemas();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('returns an empty list and null schema when no vault path is configured', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({ vaultPath: undefined });

        await expect(schemaService.getSchemas()).resolves.toEqual([]);
        await expect(schemaService.getSchema('missing.json')).resolves.toBeNull();
    });

    it('creates a schema file when a vault path is configured', async () => {
        const schemaDir = path.join(tempDir, 'Mind Graphs', 'Flexible Schemas');
        const schema = {
            id: 'alpha',
            interpretation_type: 'alpha',
            label: 'Alpha Schema',
            schema_type: 'flexible',
            node_definitions: [],
            relationship_definitions: []
        };

        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({ vaultPath: tempDir });

        await expect(schemaService.createSchema(schema)).resolves.toEqual(schema);

        expect(fs.existsSync(path.join(schemaDir, 'Alpha-Schema.json'))).toBe(true);
        expect(JSON.parse(fs.readFileSync(path.join(schemaDir, 'Alpha-Schema.json'), 'utf-8'))).toEqual(schema);
    });

    it('returns null when no vault path is configured for schema creation', async () => {
        const schema = {
            id: 'alpha',
            interpretation_type: 'alpha',
            label: 'Alpha Schema',
            schema_type: 'flexible',
            node_definitions: [],
            relationship_definitions: []
        };

        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({ vaultPath: undefined });

        await expect(schemaService.createSchema(schema)).resolves.toBeNull();
    });

    it('loads schema files from the flexible schemas directory', async () => {
        const schemaDir = path.join(tempDir, 'Mind Graphs', 'Flexible Schemas');
        fs.mkdirSync(schemaDir, { recursive: true });

        const firstSchema = { name: 'alpha', nodes: [], edges: [] };
        const secondSchema = { name: 'beta', nodes: [], edges: [] };

        fs.writeFileSync(path.join(schemaDir, 'alpha.json'), JSON.stringify(firstSchema), 'utf-8');
        fs.writeFileSync(path.join(schemaDir, 'beta.json'), JSON.stringify(secondSchema), 'utf-8');
        fs.writeFileSync(path.join(schemaDir, 'ignore.txt'), 'not a schema', 'utf-8');

        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({ vaultPath: tempDir });

        const schemas = await schemaService.getSchemas();
        const schema = await schemaService.getSchema('alpha.json');

        expect(schemas).toEqual([firstSchema, secondSchema]);
        expect(schema).toEqual(firstSchema);
    });
});
