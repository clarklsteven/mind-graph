import { describe, it, expect } from 'vitest';
import { Interpretation } from './interpretation';
import { Graph } from '../model/graph';
import { GraphInterpretation } from '../model/graph-interpretation';

describe('Interpretation', () => {
    it('should return the correct interpretation', () => {
        const interpretationData: GraphInterpretation = {
            id: 'test-interpretation',
            label: 'Test Interpretation',
            interpretation_type: 'test',
            node_definitions: [],
            relationship_definitions: [],
        };

        const interpretation = new Interpretation(interpretationData);
        expect(interpretation.getInterpretation()).toBe(interpretationData);
    });

    it('should calculate node weights correctly', () => {
        const interpretationData: GraphInterpretation = {
            id: 'test-interpretation',
            label: 'Test Interpretation',
            interpretation_type: 'test',
            node_definitions: [
                {
                    id: 'type1', isDefault: true,
                    label: ''
                },
                { id: 'type2', label: '' },
            ],
            relationship_definitions: [
                {
                    id: 'rel1', sourceWeightConsidered: true, sourceWeightMultiplier: 2,
                    label: '',
                    directed: false,
                    hierarchical: false,
                    parentEnd: null,
                    childEnd: null,
                    singleParent: null,
                    allowsCycles: null
                },
                {
                    id: 'rel2', targetWeightConsidered: true, targetWeightMultiplier: 3,
                    label: '',
                    directed: false,
                    hierarchical: false,
                    parentEnd: null,
                    childEnd: null,
                    singleParent: null,
                    allowsCycles: null
                },
            ],
        };

        const interpretation = new Interpretation(interpretationData);

        const graph = new Graph();
        graph.setInterpretation('test');
        graph.addNode({
            id: 'node1', type: 'type1',
            title: '',
            weight: 0,
            position: { x: 0, y: 0 }
        });
        graph.addNode({
            id: 'node2', type: 'type1',
            title: '',
            weight: 0,
            position: { x: 0, y: 0 }
        });
        graph.addNode({
            id: 'node3', type: 'type1',
            title: '',
            weight: 0,
            position: { x: 0, y: 0 }
        });
        graph.addEdge({ id: 'edge1', from: 'node1', to: 'node2', type: 'rel1' });
        graph.addEdge({ id: 'edge2', from: 'node2', to: 'node3', type: 'rel2' });

        interpretation.calculateNodeWeights(graph);

        expect(graph.getNode('node1')?.weight).toBe(1); // 1 (base)
        expect(graph.getNode('node2')?.weight).toBe(6); // 1 (base) + 2*1 (from node1 via rel1) + 3*1 (from node2 via rel2)
        expect(graph.getNode('node3')?.weight).toBe(1); // 1 (base)
    });
});
