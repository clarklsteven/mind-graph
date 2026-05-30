import type { Graph } from "../model/graph";

export function getDescendantNodeIds(graph: Graph, rootNodeId: string): Set<string> {
    const result = new Set<string>();
    const stack = [rootNodeId];

    while (stack.length > 0) {
        const currentId = stack.pop()!;
        result.add(currentId);

        const childIds = graph.getEdges()
            .filter(edge => edge.from === currentId)
            .map(edge => edge.to);

        for (const childId of childIds) {
            if (!result.has(childId)) {
                stack.push(childId);
            }
        }
    }

    return result;
}