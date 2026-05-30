import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GraphCoordinator } from './graph-coordinator';
import { Interpretation } from '../interpretation/interpretation';
import { Graph } from '../model/graph';
import type { GraphInterpretation } from '../model/graph-interpretation';

vi.mock('../../api/graphs', () => ({
    loadGraph: vi.fn()
}));

import { loadGraph } from '../../api/graphs';

describe('GraphCoordinator', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let clickSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
        revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { });
        clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetAllMocks();
    });

    it('creates a graph coordinator with the provided name and interpretation type', () => {
        const interpretation = new Interpretation({
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            relationship_definitions: []
        });

        const coordinator = GraphCoordinator.createGraph('My Graph', interpretation);

        expect(coordinator.getGraph()?.getName()).toBe('My Graph');
        expect(coordinator.getGraph()?.getInterpretation()).toBe('test-type');
    });

    it('normalises nodes and edges using default definitions when types are unknown', () => {
        const coordinator = new GraphCoordinator(new Interpretation({
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            relationship_definitions: [
                {
                    id: 'default-rel',
                    label: 'Default',
                    isDefault: true,
                    directed: false,
                    hierarchical: false,
                    parentEnd: null,
                    childEnd: null,
                    singleParent: null,
                    allowsCycles: null
                }
            ],
            node_definitions: [
                {
                    id: 'default-node',
                    label: 'Default Node',
                    isDefault: true,
                    properties: [{ id: 'title', label: 'Title', valueType: 'string', required: false }]
                }
            ]
        }));

        const sourceGraph = new Graph();
        sourceGraph.setName('source');
        sourceGraph.setInterpretation('unknown');
        sourceGraph.addNode({ id: 'n1', title: 'Node 1', type: 'unknown-type', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 }, properties: { title: 'Node 1' } });
        sourceGraph.addEdge({ id: 'e1', from: 'n1', to: 'n1', type: 'unknown-rel' });

        const interpretation: GraphInterpretation = {
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            node_definitions: [
                { id: 'default-node', label: 'Default Node', isDefault: true, properties: [{ id: 'title', label: 'Title', valueType: 'string', required: false }] }
            ],
            relationship_definitions: [
                {
                    id: 'default-rel',
                    label: 'Default Rel',
                    isDefault: true,
                    directed: false,
                    hierarchical: false,
                    parentEnd: null,
                    childEnd: null,
                    singleParent: null,
                    allowsCycles: null
                }
            ]
        };

        const normalised = coordinator.normaliseGraph(sourceGraph, interpretation);

        expect(normalised.getNodes()).toHaveLength(1);
        expect(normalised.getNodes()[0].type).toBe('default-node');
        expect(normalised.getNodes()[0].properties).toEqual({ title: 'Node 1' });
        expect(warnSpy).toHaveBeenCalledWith('Node n1 has unknown type unknown-type, using default type');
        expect(warnSpy).toHaveBeenCalledWith('Edge e1 has unknown type unknown-rel, using default type');
        expect(normalised.getEdges()).toHaveLength(1);
        expect(normalised.getEdges()[0].type).toBe('default-rel');
    });

    it('skips edges that reference missing nodes', () => {
        const coordinator = new GraphCoordinator(new Interpretation({
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            relationship_definitions: [{
                id: 'default-rel',
                label: 'Default',
                isDefault: true,
                directed: false,
                hierarchical: false,
                parentEnd: null,
                childEnd: null,
                singleParent: null,
                allowsCycles: null
            }],
            node_definitions: [{ id: 'default-node', label: 'Default Node', isDefault: true, properties: [] }]
        }));

        const sourceGraph = new Graph();
        sourceGraph.addNode({ id: 'n1', title: 'Node 1', type: 'default-node', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        sourceGraph.addEdge({ id: 'e1', from: 'n1', to: 'n2', type: 'default-rel' });

        const interpretation: GraphInterpretation = {
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            node_definitions: [{ id: 'default-node', label: 'Default Node', isDefault: true, properties: [] }],
            relationship_definitions: [{
                id: 'default-rel',
                label: 'Default Rel',
                isDefault: true,
                directed: false,
                hierarchical: false,
                parentEnd: null,
                childEnd: null,
                singleParent: null,
                allowsCycles: null
            }]
        };

        const normalised = coordinator.normaliseGraph(sourceGraph, interpretation);

        expect(normalised.getEdges()).toHaveLength(0);
        expect(warnSpy).toHaveBeenCalledWith('Edge e1 references missing nodes, skipping');
    });

    it('saveGraph generates a download link and revokes the URL', () => {
        const coordinator = new GraphCoordinator(new Interpretation({
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            relationship_definitions: [],
            node_definitions: []
        }));

        coordinator.getGraph()?.setName('Untitled Graph');
        coordinator.saveGraph();

        expect(createObjectURLSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test');
    });

    it('loads a graph and applies interpretation registry entries', async () => {
        const graphData = {
            name: 'loaded',
            interpretation: 'test-type',
            nodes: [{ id: 'n1', title: 'Node 1', type: 'node-type', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } }],
            edges: []
        };

        const loadGraphMock = vi.mocked(loadGraph);
        loadGraphMock.mockResolvedValueOnce(graphData);

        const interpretation: GraphInterpretation = {
            id: 'test',
            interpretation_type: 'test-type',
            label: 'Test',
            node_definitions: [{ id: 'node-type', label: 'Node Type', isDefault: true }],
            relationship_definitions: []
        };

        const coordinator = new GraphCoordinator(new Interpretation({
            id: 'initial',
            interpretation_type: 'initial-type',
            label: 'Initial',
            relationship_definitions: [],
            node_definitions: []
        }));

        await coordinator.loadGraph('loaded', { 'test-type': interpretation });

        expect(coordinator.getGraph()?.getName()).toBe('loaded');
        expect(coordinator.getInterpretation().getInterpretation().interpretation_type).toBe('test-type');
    });
});
