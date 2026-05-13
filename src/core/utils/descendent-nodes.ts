import { Graph } from "../model/graph";

export function getDescendantNodeIds(graph: Graph, rootNodeId: string): Set<string> {
    const result = new Set<string>();
    const stack = [rootNodeId];

    while (stack.length > 0) {
        const currentId = stack.pop()!;
        result.add(currentId);

        const childIds = graph.getEdges()
            .filter(edge => edge.from === currentId)
            .map(edge => edge.to);

        stack.push(...childIds);
    }

    return result;
}