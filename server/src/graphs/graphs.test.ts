import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Graphs } from './graphs';
import { UserSettings } from '../user/user-settings';
import type { GraphData } from '../../../client/src/core/model/graph-data';

describe('Graphs', () => {
    let tempDir: string;
    let graphsFolder: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mind-graph-'));
        graphsFolder = path.join(tempDir, 'Mind Graphs');
        fs.mkdirSync(graphsFolder, { recursive: true });
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({
            vaultPath: tempDir
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('returns an empty array when settings do not include a vault path', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({});
        const graphs = new Graphs();

        expect(await graphs.getGraphs()).toEqual([]);
    });

    it('loads metadata for graph files in the vault', async () => {
        const graphPath = path.join(graphsFolder, 'example.json');
        const graphData: GraphData = {
            name: 'example',
            interpretation: 'demo',
            nodes: [],
            edges: []
        };
        fs.writeFileSync(graphPath, JSON.stringify(graphData), 'utf-8');

        const graphs = new Graphs();
        const result = await graphs.getGraphs();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(
            expect.objectContaining({
                name: 'example.json',
                interpretation: 'demo'
            })
        );
        expect(new Date(result[0].lastModified).toISOString()).toEqual(result[0].lastModified);
    });

    it('reads a graph by name when the file exists', async () => {
        const graphData: GraphData = {
            name: 'example',
            interpretation: 'demo',
            nodes: [],
            edges: []
        };
        const graphPath = path.join(graphsFolder, 'example.json');
        fs.writeFileSync(graphPath, JSON.stringify(graphData), 'utf-8');

        const graphs = new Graphs();
        const result = await graphs.getGraph('example');

        expect(result).toEqual(graphData);
    });

    it('returns null when requesting a nonexistent graph', async () => {
        const graphs = new Graphs();

        expect(await graphs.getGraph('missing')).toBeNull();
    });

    it('returns null when getting a graph if the settings do not include a vault path', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({});
        const graphs = new Graphs();

        expect(await graphs.getGraph('example')).toBeNull();
    });

    it('returns null when creating a graph if the settings do not include a vault path', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockResolvedValue({});
        const graphs = new Graphs();

        expect(await graphs.createGraph({
            name: 'example',
            interpretation: 'demo',
            nodes: [],
            edges: []
        })).toBeNull();
    });

    it('returns null when updating a graph if the settings do not include a vault path', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({});
        const graphs = new Graphs();

        expect(await graphs.updateGraph('example', {
            name: 'example',
            interpretation: 'demo',
            nodes: [],
            edges: []
        })).toBeNull();
    });

    it('creates a new graph file when none exists', async () => {
        const graphs = new Graphs();
        const graphData: GraphData = {
            name: 'new-graph',
            interpretation: 'thinking',
            nodes: [],
            edges: []
        };
        const result = await graphs.createGraph(graphData);

        expect(result).toEqual({
            name: 'new-graph',
            interpretation: 'thinking',
            nodes: [],
            edges: []
        });
        expect(fs.existsSync(path.join(graphsFolder, 'new-graph.json'))).toBe(true);
    });

    it('does not update a graph when immutable properties change', async () => {
        const graphData: GraphData = {
            name: 'existing',
            interpretation: 'demo',
            nodes: [],
            edges: []
        };
        const graphPath = path.join(graphsFolder, 'existing.json');
        fs.writeFileSync(graphPath, JSON.stringify(graphData), 'utf-8');

        const graphs = new Graphs();
        const updatedGraph = await graphs.updateGraph('existing', {
            name: 'different-name',
            interpretation: 'demo',
            nodes: [],
            edges: []
        });

        expect(updatedGraph).toBeNull();
    });

    it('writes back an updated graph when immutable fields remain unchanged', async () => {
        const originalGraph: GraphData = {
            name: 'existing',
            interpretation: 'demo',
            nodes: [],
            edges: []
        };
        const graphPath = path.join(graphsFolder, 'existing.json');
        fs.writeFileSync(graphPath, JSON.stringify(originalGraph), 'utf-8');

        const graphs = new Graphs();
        const replacementGraph: GraphData = {
            name: 'existing',
            interpretation: 'demo',
            nodes: [{ id: 'node-1', title: 'A', weight: 1, position: { x: 0, y: 0 }, type: "Type A", size: { width: 8, height: 8 } }],
            edges: []
        };
        const result = await graphs.updateGraph('existing', replacementGraph);

        expect(result).toEqual(replacementGraph);
        expect(JSON.parse(fs.readFileSync(graphPath, 'utf-8'))).toEqual(replacementGraph);
    });

    it('logs and continues when a graph file contains invalid JSON during getGraphs', async () => {
        const badPath = path.join(graphsFolder, 'bad.json');
        fs.writeFileSync(badPath, '{ this is not: valid json }', 'utf-8');

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const graphs = new Graphs();
        const result = await graphs.getGraphs();

        // the invalid file should be skipped and no graphs returned (since only bad file exists)
        expect(result).toEqual([]);
        expect(errorSpy).toHaveBeenCalled();
        const calledWith = (errorSpy.mock.calls[0] && errorSpy.mock.calls[0][0]) || '';
        expect(calledWith).toContain('Error reading or parsing graph file');
        expect(calledWith).toContain(badPath);
    });

    it('logs and returns null when getGraph encounters invalid JSON', async () => {
        const badPath = path.join(graphsFolder, 'broken.json');
        fs.writeFileSync(badPath, '{ not valid json', 'utf-8');

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const graphs = new Graphs();
        const result = await graphs.getGraph('broken');

        expect(result).toBeNull();
        expect(errorSpy).toHaveBeenCalled();
        const calledWith = (errorSpy.mock.calls[0] && errorSpy.mock.calls[0][0]) || '';
        expect(calledWith).toContain('Error parsing graph file');
        expect(calledWith).toContain(path.join(graphsFolder, 'broken.json'));
    });

    it('logs and returns null when updateGraph cannot parse the existing file', async () => {
        const badPath = path.join(graphsFolder, 'existing.json');
        fs.writeFileSync(badPath, '{ not valid json', 'utf-8');

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const graphs = new Graphs();
        const result = await graphs.updateGraph('existing', {
            name: 'existing',
            interpretation: 'demo',
            nodes: [],
            edges: []
        });

        expect(result).toBeNull();
        expect(errorSpy).toHaveBeenCalled();
        const calledWith = (errorSpy.mock.calls[0] && errorSpy.mock.calls[0][0]) || '';
        expect(calledWith).toContain('Error parsing existing graph file');
        expect(calledWith).toContain(badPath);
    });
});
