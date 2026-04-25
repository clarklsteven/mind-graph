import { describe, it, expect } from 'vitest';
import { Graph } from './graph';
import { GraphNode } from './node';
import { Edge } from './edge';

describe('Graph', () => {
    it('should have a name that can be set and retrieved', () => {
        const graph = new Graph();
        expect(graph.getName()).toBe('');

        graph.setName('Test Graph');
        expect(graph.getName()).toBe('Test Graph');
    });

    it('should add a node', () => {
        const graph = new Graph();
        const node: GraphNode = { id: '1', title: 'Test Node', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };

        graph.addNode(node);
        const retrieved = graph.getNode('1');

        expect(retrieved).toEqual(node);
    });

    it('should get all nodes', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };

        graph.addNode(node1);
        graph.addNode(node2);

        const nodes = graph.getNodes();
        expect(nodes).toHaveLength(2);
        expect(nodes).toContainEqual(node1);
        expect(nodes).toContainEqual(node2);
    });

    it('should delete a node and its associated edges', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        expect(graph.getEdges()).toHaveLength(1);

        graph.deleteNode('1');

        expect(graph.getNode('1')).toBeUndefined();
        expect(graph.getEdges()).toHaveLength(0);
    });

    it('should add an edge', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        expect(graph.getEdges()).toHaveLength(1);
        expect(graph.getEdges()[0]).toEqual(edge);
    });

    it('should delete an edge', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        expect(graph.getEdges()).toHaveLength(1);

        graph.deleteEdge('e1');

        expect(graph.getEdges()).toHaveLength(0);
    });

    it('should get a specific edge', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        const retrieved = graph.getEdge('e1');
        expect(retrieved).toEqual(edge);
    });

    it('shounld get all edges', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const edge1: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };
        const edge2: Edge = { id: 'e2', from: '2', to: '1', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge1);
        graph.addEdge(edge2);

        const edges = graph.getEdges();
        expect(edges).toHaveLength(2);
        expect(edges).toContainEqual(edge1);
        expect(edges).toContainEqual(edge2);
    });

    it('should get a specific node', () => {
        const graph = new Graph();
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };

        graph.addNode(node);
        const retrieved = graph.getNode('1');

        expect(retrieved).toEqual(node);
    });

    it('should get connected nodes', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 1, position: { x: 0, y: 0 }, type: "Type C" };
        const edge1: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };
        const edge2: Edge = { id: 'e2', from: '1', to: '3', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        graph.addEdge(edge1);
        graph.addEdge(edge2);

        const connected = graph.getConnectedNodes('1');
        expect(connected).toHaveLength(2);
        expect(connected).toContainEqual(node2);
        expect(connected).toContainEqual(node3);
    });

    it('should get connected edges', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 1, position: { x: 0, y: 0 }, type: "Type C" };
        const edge1: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };
        const edge2: Edge = { id: 'e2', from: '1', to: '3', type: "Relates To" };
        const edge3: Edge = { id: 'e3', from: '2', to: '3', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        graph.addEdge(edge1);
        graph.addEdge(edge2);
        graph.addEdge(edge3);

        const connectedEdges = graph.getConnectedEdges('1');
        expect(connectedEdges).toHaveLength(2);
        expect(connectedEdges).toContainEqual(edge1);
        expect(connectedEdges).toContainEqual(edge2);
    });

    it('should get connection count', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1, position: { x: 0, y: 0 }, type: "Type B" };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 1, position: { x: 0, y: 0 }, type: "Type C" };
        const edge1: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };
        const edge2: Edge = { id: 'e2', from: '1', to: '3', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        graph.addEdge(edge1);
        graph.addEdge(edge2);

        expect(graph.getConnectionCount('1')).toBe(2);
    });

    it('should export graph data', () => {
        const graph = new Graph();
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const edge: Edge = { id: 'e1', from: '1', to: '1', type: "Relates To" };

        graph.addNode(node);
        graph.addEdge(edge);

        const exported = graph.export();

        expect(exported.nodes).toHaveLength(1);
        expect(exported.edges).toHaveLength(1);
    });

    it('should import graph data', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const edge: Edge = { id: 'e1', from: '1', to: '1', type: "Relates To" };

        const imported = new Graph().import({
            nodes: [node],
            edges: [edge],
            interpretation: "Test Interpretation",
            name: "Test Graph"
        });

        expect(imported.getNodes()).toHaveLength(1);
        expect(imported.getEdges()).toHaveLength(1);
    });

    it('should throw on import with duplicate node ids', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };

        expect(() => {
            new Graph().import({
                nodes: [node, node],
                edges: [],
                interpretation: "Test Interpretation",
                name: "Test Graph"
            });
        }).toThrow('Duplicate node id: 1');
    });

    it('should throw on import with edge missing from node', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const edge: Edge = { id: 'e1', from: '1', to: 'missing', type: "Relates To" };

        expect(() => {
            new Graph().import({
                nodes: [node],
                edges: [edge],
                interpretation: "Test Interpretation",
                name: "Test Graph"
            });
        }).toThrow('Edge e1 refers to missing to node: missing');

        const node2: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const edge2: Edge = { id: 'e1', from: 'missing', to: 'e1', type: "Relates To" };

        expect(() => {
            new Graph().import({
                nodes: [node2],
                edges: [edge2],
                interpretation: "Test Interpretation",
                name: "Test Graph"
            });
        }).toThrow('Edge e1 refers to missing from node: missing');
    });

    it('should return node weight', () => {
        const graph = new Graph();
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 5, position: { x: 0, y: 0 }, type: "Type A" };

        graph.addNode(node);
        expect(graph.getNodeWeight('1')).toBe(5);
        expect(graph.getNodeWeight('missing')).toBe(0);
    });

    it('should set and get interpretation', () => {
        const graph = new Graph();
        expect(graph.getInterpretation()).toBe('');

        graph.setInterpretation('Test Interpretation');
        expect(graph.getInterpretation()).toBe('Test Interpretation');
    });

    it('should serialise and deserialise', () => {
        const graph = new Graph();
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1, position: { x: 0, y: 0 }, type: "Type A" };
        const edge: Edge = { id: 'e1', from: '1', to: '1', type: "Relates To" };

        graph.addNode(node);
        graph.addEdge(edge);
        graph.setName('Test Graph');
        graph.setInterpretation('Test Interpretation');

        const serialised = graph.serialise();
        const deserialised = Graph.deserialise(serialised);

        expect(deserialised.getName()).toBe('Test Graph');
        expect(deserialised.getInterpretation()).toBe('Test Interpretation');
        expect(deserialised.getNodes()).toHaveLength(1);
        expect(deserialised.getEdges()).toHaveLength(1);
    });
});
