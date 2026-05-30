import { describe, it, expect } from 'vitest';
import { Graph } from '../model/graph';
import { getDescendantNodeIds } from './descendent-nodes';

describe('getDescendantNodeIds', () => {
    it('returns the root node and its descendant nodes in a simple tree', () => {
        const graph = new Graph();
        graph.addNode({ id: '1', title: 'Root', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addNode({ id: '2', title: 'Child A', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addNode({ id: '3', title: 'Child B', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addNode({ id: '4', title: 'Grandchild', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addEdge({ id: 'e1', from: '1', to: '2', type: 'Relates To' });
        graph.addEdge({ id: 'e2', from: '1', to: '3', type: 'Relates To' });
        graph.addEdge({ id: 'e3', from: '2', to: '4', type: 'Relates To' });

        const result = getDescendantNodeIds(graph, '1');

        expect(Array.from(result).sort()).toEqual(['1', '2', '3', '4']);
    });

    it('handles cycles without looping infinitely', () => {
        const graph = new Graph();
        graph.addNode({ id: 'a', title: 'A', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addNode({ id: 'b', title: 'B', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addNode({ id: 'c', title: 'C', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });
        graph.addEdge({ id: 'e1', from: 'a', to: 'b', type: 'Relates To' });
        graph.addEdge({ id: 'e2', from: 'b', to: 'c', type: 'Relates To' });
        graph.addEdge({ id: 'e3', from: 'c', to: 'a', type: 'Relates To' });

        const result = getDescendantNodeIds(graph, 'a');

        expect(Array.from(result).sort()).toEqual(['a', 'b', 'c']);
    });

    it('returns only the root node when it has no children', () => {
        const graph = new Graph();
        graph.addNode({ id: 'x', title: 'Leaf', type: 'topic', weight: 1, position: { x: 0, y: 0 }, size: { width: 10, height: 10 } });

        const result = getDescendantNodeIds(graph, 'x');

        expect(Array.from(result)).toEqual(['x']);
    });
});
