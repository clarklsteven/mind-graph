import { describe, it, expect } from 'vitest';
import { Graph } from './graph';
import { GraphNode } from './node';
import { Edge } from './edge';

describe('Graph', () => {
    it('should add a node', () => {
        const graph = new Graph();
        const node: GraphNode = {
            id: '1',
            title: 'Test Node',
            weight: 1,
        };

        graph.addNode(node);
        const retrieved = graph.getNode('1');

        expect(retrieved).toEqual(node);
    });

    it('should get all nodes', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };

        graph.addNode(node1);
        graph.addNode(node2);

        const nodes = graph.getNodes();
        expect(nodes).toHaveLength(2);
        expect(nodes).toContainEqual(node1);
        expect(nodes).toContainEqual(node2);
    });

    it('should delete a node and its associated edges', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
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
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        expect(graph.getEdges()).toHaveLength(1);
        expect(graph.getEdges()[0]).toEqual(edge);
    });

    it('should delete an edge', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
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
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
        const edge: Edge = { id: 'e1', from: '1', to: '2', type: "Relates To" };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addEdge(edge);

        const retrieved = graph.getEdge('e1');
        expect(retrieved).toEqual(edge);
    });

    it('shounld get all edges', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
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
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1 };

        graph.addNode(node);
        const retrieved = graph.getNode('1');

        expect(retrieved).toEqual(node);
    });

    it('should get connected nodes', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 1 };
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

    it('should get connection count', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 1 };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 1 };
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
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const edge: Edge = { id: 'e1', from: '1', to: '1', type: "Relates To" };

        graph.addNode(node);
        graph.addEdge(edge);

        const exported = graph.export();

        expect(exported.nodes).toHaveLength(1);
        expect(exported.edges).toHaveLength(1);
    });

    it('should import graph data', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const edge: Edge = { id: 'e1', from: '1', to: '1', type: "Relates To" };

        const imported = new Graph().import({
            nodes: [node],
            edges: [edge],
        });

        expect(imported.getNodes()).toHaveLength(1);
        expect(imported.getEdges()).toHaveLength(1);
    });

    it('should throw on import with duplicate node ids', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1 };

        expect(() => {
            new Graph().import({
                nodes: [node, node],
                edges: [],
            });
        }).toThrow('Duplicate node id: 1');
    });

    it('should throw on import with edge missing from node', () => {
        const node: GraphNode = { id: '1', title: 'Node 1', weight: 1 };
        const edge: Edge = { id: 'e1', from: '1', to: 'missing', type: "Relates To" };

        expect(() => {
            new Graph().import({
                nodes: [node],
                edges: [edge],
            });
        }).toThrow('Edge e1 refers to missing to node: missing');
    });

    it('should calculate node weights based on connections', () => {
        const graph = new Graph();
        const node1: GraphNode = { id: '1', title: 'Node 1', weight: 0 };
        const node2: GraphNode = { id: '2', title: 'Node 2', weight: 0 };
        const node3: GraphNode = { id: '3', title: 'Node 3', weight: 0 };

        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);

        // Node 1 has no connections: weight should be 1
        expect(graph.getNodeWeight('1')).toBe(1);

        // Add edges
        graph.addEdge({ id: 'e1', from: '1', to: '2', type: "Relates To" });
        graph.addEdge({ id: 'e2', from: '1', to: '3', type: "Relates To" });

        // Node 1 now has 2 connections: weight should be 1 + sqrt(2)
        expect(graph.getNodeWeight('1')).toBeCloseTo(1 + Math.sqrt(2));
    });
});
