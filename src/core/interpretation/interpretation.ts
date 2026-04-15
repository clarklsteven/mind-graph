import { Graph } from "../model/graph";
import { GraphInterpretation } from "../model/graph-interpretation";

export class Interpretation {
    private interpretation: GraphInterpretation;

    constructor(interpretation: GraphInterpretation) {
        this.interpretation = interpretation;
    }

    getInterpretation(): GraphInterpretation {
        return this.interpretation;
    }

    calculateNodeWeights(graph: Graph) {
        let hasChanged = true;
        while (hasChanged) {
            hasChanged = false;
            for (const node of graph.getNodes()) {
                const connectedEdges = graph.getConnectedEdges(node.id);
                let newWeight = 1;
                for (const edge of connectedEdges) {
                    const otherNodeId = edge.from === node.id ? edge.to : edge.from;
                    const otherNode = graph.getNode(otherNodeId);
                    if (!otherNode) continue;

                    const relationshipDef = this.interpretation.relationship_definitions.find(def => def.id === edge.type);
                    console.log(`Found relationship definition for edge ${edge.id} of type ${edge.type}: ${JSON.stringify(relationshipDef)}`);
                    if (!relationshipDef) continue;
                    if (relationshipDef.sourceWeightConsidered && edge.to === node.id) {
                        newWeight += (otherNode.weight || 1) * (relationshipDef.sourceWeightMultiplier || 1);
                    }
                    if (relationshipDef.targetWeightConsidered && edge.from === node.id) {
                        newWeight += (otherNode.weight || 1) * (relationshipDef.targetWeightMultiplier || 1);
                    }
                }
                console.log(`Calculated new weight for node ${node.id} (${node.title}): ${node.weight}/${newWeight}`);
                if (node.weight !== newWeight) {
                    node.weight = newWeight;
                    hasChanged = true;
                }
            }
        }
    }
}
